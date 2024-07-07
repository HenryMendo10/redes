from os import name  # Importa solo el módulo 'name' del sistema operativo
import requests  # Importa el módulo para realizar solicitudes HTTP
import hashlib  # Importa el módulo para funciones hash criptográficas
import json  # Importa el módulo para trabajar con JSON
import time  # Importa el módulo para trabajar con fechas y tiempos
from datetime import datetime  # Importa la clase datetime para manipular fechas
from collections import defaultdict  # Importa el módulo para crear diccionarios con valores predeterminados
from psycopg2 import pool  # Importa el módulo para la conexión a PostgreSQL

# permite el uso de GET y post con url´s
from flask import Flask, request, jsonify  # Importa Flask y funciones relacionadas
from flask_cors import CORS, cross_origin  # Importa CORS para manejar CORS en Flask (manipular datos, scripts en paginas web)


from logic import BOUGHT, SOLD, format_db_row_to_transaction, Transaction  # Importa funciones y clases desde 'logic'
from blockchain import CadenaBloques, Transaction  # Importa clases de tu implementación de blockchain

LIVE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price"  # URL para obtener precios en vivo desde CoinGecko

app = Flask(__name__)  # Crea una instancia de Flask
cors = CORS(app)  # Habilita CORS para la aplicación Flask

# Configuración y creación de un pool de conexiones PostgreSQL
postgreSQL_pool = pool.SimpleConnectionPool(
    1, 40, database="exampledb", user="docker", password="docker", host="localhost"
)
app.config['postgreSQL_pool'] = postgreSQL_pool

blockchain = CadenaBloques(dificultad=4)  # Instancia de tu cadena de bloques con dificultad 4

@app.route("/")
def health_check():
    return "yeah"  # Ruta de prueba para verificar la salud del servidor


def calcular_hash(transaccion):
    transaccion_str = json.dumps(transaccion, default=str)  # Convierte la transacción a JSON
    return hashlib.sha256(transaccion_str.encode()).hexdigest()  # Calcula y devuelve el hash SHA-256 de la transacción

@app.route("/transactions", methods=["POST"])
def new_transaction():
    # Extrae los datos de la transacción del cuerpo de la solicitud JSON
    name = request.json["name"]
    symbol = request.json["symbol"]
    type = request.json["type"]
    amount = request.json["amount"]
    time_transacted = datetime.fromtimestamp(request.json["time_transacted"])
    time_created = datetime.fromtimestamp(request.json["time_created"])
    price_purchased_at = float(request.json["price_purchased_at"])
    no_of_coins = float(request.json["no_of_coins"])

    # Crea un diccionario con los datos de la transacción
    transaccion_data = {
        "id": None,
        "name": name,
        "symbol": symbol,
        "type": type,
        "amount": amount,
        "time_transacted": time_transacted,
        "time_created": time_created,
        "price_purchased_at": price_purchased_at,
        "no_of_coins": no_of_coins,
        "hash": ''  # Temporalmente vacío, se calculará después
    }

    # Calcula el hash de la transacción
    hash_transaccion = calcular_hash(transaccion_data)
    transaccion_data["hash"] = hash_transaccion

    # Obtiene una conexión del pool PostgreSQL
    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    # Prepara la sentencia SQL para insertar la transacción en la base de datos
    insert_statement = """
    INSERT INTO transaction (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins, hash) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
    RETURNING *
    """

    # Ejecuta la sentencia SQL con los datos de la transacción
    cur.execute(insert_statement, (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins, hash_transaccion))
    conn.commit()  # Confirma la transacción en la base de datos

    # Prepara los datos de respuesta JSON
    response_data = {
        "name": name,
        "symbol": symbol,
        "type": type,
        "amount": amount,
        "time_transacted": time_transacted.strftime("%Y-%m-%d"),  # Formatea la fecha como string
        "time_created": time_created.strftime("%Y-%m-%d"),
        "price_purchased_at": price_purchased_at,
        "no_of_coins": no_of_coins,
        "hash": hash_transaccion
    }

    return jsonify(response_data)  # Devuelve los datos de respuesta como JSON

@app.route("/transactions")
@cross_origin()
def get_transactions():
    cur = postgreSQL_pool.getconn().cursor()  # Obtiene un cursor de conexión PostgreSQL
    cur.execute("SELECT * FROM transaction")  # Ejecuta la consulta SQL para seleccionar todas las transacciones
    rows = cur.fetchall()  # Obtiene todas las filas resultantes de la consulta

    # Formatea cada fila de la base de datos como una transacción y lo convierte en JSON
    return jsonify(
        [
            format_db_row_to_transaction(row)
            for row in rows
        ]
    )

@app.route("/get_rollups_by_coin")
def get_rollups_by_coin():
    # Crea un diccionario defaultdict para almacenar el portafolio por moneda
    portfolio = defaultdict(
        lambda: {
            "coins": 0,
            "total_cost": 0,
            "total_equity": 0,
            "live_price": 0
        }
    )

    conn = postgreSQL_pool.getconn()  # Obtiene una conexión PostgreSQL
    cur = conn.cursor()
    cur.execute(
        "SELECT symbol, type, SUM(amount)/100 AS total_amount, SUM(no_of_coins) AS total_coins FROM transaction GROUP BY symbol, type"
    )
    
    rows = cur.fetchall()  # Obtiene todas las filas resultantes de la consulta

    # Itera sobre las filas para calcular el costo y la equidad total por moneda
    for row in rows:
        coin = row[0].strip()
        transaction_type = row[1]
        transaction_amount = row[2]
        transaction_coins = row[3]

        # Actualiza el portafolio según el tipo de transacción (compra o venta)
        if transaction_type == 1:
            portfolio[coin]['total_cost'] += transaction_amount
            portfolio[coin]['coins'] += transaction_coins
        else:
            portfolio[coin]['total_cost'] -= transaction_amount
            portfolio[coin]['coins'] -= transaction_coins

    # Mapeo de símbolos a identificadores de moneda para CoinGecko
    symbol_to_coin_id_map = {
        "BTC": "bitcoin",
        "SOL": "solana",
        "LINK": "chainlink",
        "ETH": "ethereum",
        "ADA": "cardano",
    }

    rollups_response = []  # Lista para almacenar la respuesta de rollups

    # Itera sobre el portafolio para obtener el precio en vivo y calcular la equidad total
    for symbol in portfolio:
        response = requests.get(
            f"{LIVE_PRICE_URL}?ids={symbol_to_coin_id_map[symbol]}&vs_currencies=usd"
            ).json()
        
        live_price = response[symbol_to_coin_id_map[symbol]]['usd']  # Obtiene el precio en vivo de CoinGecko

        # Actualiza el portafolio con el precio en vivo y la equidad total
        portfolio[symbol]['live_price'] = live_price
        portfolio[symbol]['total_equity'] = float(
            float(portfolio[symbol]['coins']) * live_price
        )
        
        # Agrega los datos de rollups a la respuesta
        rollups_response.append({
                "symbol": symbol,
                "live_price": portfolio[symbol]['live_price'],
                "total_equity": portfolio[symbol]['total_equity'],
                "coins": portfolio[symbol]['coins'],
                "total_cost": portfolio[symbol]["total_cost"]
        })

    return jsonify(rollups_response)  # Devuelve la respuesta de rollups como JSON

@app.route("/blocks", methods=["GET"])
def get_blocks():
    cur = postgreSQL_pool.getconn().cursor()  # Obtiene un cursor de conexión PostgreSQL
    cur.execute("SELECT symbol, type, amount, no_of_coins FROM transaction")  # Ejecuta la consulta SQL para seleccionar todas las transacciones
    rows = cur.fetchall()  # Obtiene todas las filas resultantes de la consulta

    blocks_json = []  # Lista para almacenar los bloques en formato JSON

    # Itera sobre los bloques de la cadena de bloques para formatearlos como JSON
    for bloque in blockchain.cadena[1:]:  # Excluye el bloque génesis
        transacciones_mostradas = []  # Lista para almacenar las transacciones en formato JSON
        for row in rows:
            transaction_data = {
                "symbol": row[0].strip(),
                "type": row[1],
                "amount": row[2] / 100,  # Ajusta según la unidad de tu base de datos
                "no_of_coins": row[3]
            }
            transacciones_mostradas.append(transaction_data)  # Agrega cada transacción al bloque

        # Crea un diccionario con los datos del bloque
        block_data = {
            "Bloque": bloque.indice,
            "Marca de tiempo": bloque.marca_de_tiempo,
            "Transacciones": transacciones_mostradas,
            "Nonce": bloque.nonce,
            "Hash": bloque.hash
        }
        blocks_json.append(block_data)  # Agrega los datos del bloque a la lista de bloques JSON

    return jsonify(blocks_json)  # Devuelve los bloques en formato JSON

@app.route("/mine", methods=["GET"])
def mine_block():
    direccion_minero = "Minero1"  # Dirección del minero (puede ser dinámica según la implementación)
    blockchain.minar_transacciones_pendientes(direccion_minero)  # Proceso de minería de bloques pendientes
    return "Bloque minado exitosamente."  # Mensaje de éxito al minar un bloque

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Ejecuta la aplicación Flask en modo debug en el puerto 5000
