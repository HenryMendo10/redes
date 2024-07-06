
from os import name
import requests
import hashlib
import json
import time
from datetime import datetime
from collections import defaultdict
from datetime import datetime
from psycopg2 import pool
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from logic import BOUGHT, SOLD, format_db_row_to_transaction, Transaction
from blockchain import CadenaBloques, Transaction # Importa las clases de tu implementación de blockchain

LIVE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price"

app = Flask(__name__)
cors = CORS(app)

postgreSQL_pool = pool.SimpleConnectionPool(
    1, 40, database="exampledb", user="docker", password="docker", host="localhost"
)
app.config['postgreSQL_pool'] = postgreSQL_pool

blockchain = CadenaBloques(dificultad=4)  # Instancia de tu cadena de bloques

@app.route("/")
def health_check():
    return "yeah"

def calcular_hash(transaccion):
    transaccion_str = json.dumps(transaccion, default=str)
    return hashlib.sha256(transaccion_str.encode()).hexdigest()

@app.route("/transactions", methods=["POST"])
def new_transaction():
    name = request.json["name"]
    symbol = request.json["symbol"]
    type = request.json["type"]
    amount = request.json["amount"]

    time_transacted = datetime.fromtimestamp(request.json["time_transacted"])
    time_created = datetime.fromtimestamp(request.json["time_created"])
    price_purchased_at = float(request.json["price_purchased_at"])
    no_of_coins = float(request.json["no_of_coins"])

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

    hash_transaccion = calcular_hash(transaccion_data)
    transaccion_data["hash"] = hash_transaccion

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    insert_statement = """
    INSERT INTO transaction (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins, hash) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) 
    RETURNING *
    """

    cur.execute(insert_statement, (name, symbol, type, amount, time_transacted, time_created, price_purchased_at, no_of_coins, hash_transaccion))
    conn.commit()

    response_data = {
        "name": name,
        "symbol": symbol,
        "type": type,
        "amount": amount,
        "time_transacted": time_transacted.strftime("%Y-%m-%d"),  # datetime a string
        "time_created": time_created.strftime("%Y-%m-%d"),
        "price_purchased_at": price_purchased_at,
        "no_of_coins": no_of_coins,
        "hash": hash_transaccion
    }

    return jsonify(response_data)

@app.route("/transactions")
@cross_origin()
def get_transactions():
    cur = postgreSQL_pool.getconn().cursor()
    cur.execute("SELECT * FROM transaction")
    rows = cur.fetchall()
    return jsonify(
        [
            format_db_row_to_transaction(row)
            for row in rows
        ]
    )

@app.route("/get_rollups_by_coin")
def get_rollups_by_coin():
    portfolio = defaultdict(
        lambda: {
            "coins": 0,
            "total_cost": 0,
            "total_equity": 0,
            "live_price": 0
        }
    )

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()
    cur.execute(
        "SELECT symbol, type, SUM(amount)/100 AS total_amount, SUM(no_of_coins) AS total_coins FROM transaction GROUP BY symbol, type"
    )
    
    rows = cur.fetchall()
    for row in rows:
        coin = row[0].strip()
        transaction_type = row[1]
        transaction_amount = row[2]
        transaction_coins = row[3]

        if transaction_type == 1:
            portfolio[coin]['total_cost'] += transaction_amount
            portfolio[coin]['coins'] += transaction_coins
        else:
            portfolio[coin]['total_cost'] -= transaction_amount
            portfolio[coin]['coins'] -= transaction_coins

    symbol_to_coin_id_map = {
        "BTC": "bitcoin",
        "SOL": "solana",
        "LINK": "chainlink",
        "ETH": "ethereum",
        "ADA": "cardano",
    }

    rollups_response = []

    for symbol in portfolio:
        response = requests.get(
            f"{LIVE_PRICE_URL}?ids={symbol_to_coin_id_map[symbol]}&vs_currencies=usd"
            ).json()
        
        live_price = response[symbol_to_coin_id_map[symbol]]['usd']

        portfolio[symbol]['live_price'] = live_price
        portfolio[symbol]['total_equity'] = float(
            float(portfolio[symbol]['coins']) * live_price
        )
        
        rollups_response.append({
                "symbol": symbol,
                "live_price": portfolio[symbol]['live_price'],
                "total_equity": portfolio[symbol]['total_equity'],
                "coins": portfolio[symbol]['coins'],
                "total_cost": portfolio[symbol]["total_cost"]
        })

    return jsonify(rollups_response)

@app.route("/blocks", methods=["GET"])
def get_blocks():
    blocks_json = []
    for bloque in blockchain.cadena[1:]:  # Excluye el bloque génesis
        transacciones_mostradas = []
        for tx in bloque.transacciones:
            transaction_data = {
                "id": id,
                "name": name,
                "symbol": symbol,
                "type": type,
                "amount": tx.amount / 100,  # Ajusta según la unidad de tu base de datos
                "no_of_coins": tx.no_of_coins
            }
            transacciones_mostradas.append(transaction_data)

        block_data = {
            "Bloque": bloque.indice,
            "Marca de tiempo": bloque.marca_de_tiempo,
            "Transacciones": transacciones_mostradas,
            "Nonce": bloque.nonce,
            "Hash": bloque.hash
        }
        blocks_json.append(block_data)

    return jsonify(blocks_json)

@app.route("/mine", methods=["GET"])
def mine_block():
    direccion_minero = "Minero1"
    blockchain.minar_transacciones_pendientes(direccion_minero)
    return "Bloque minado exitosamente."

if __name__ == "__main__":
    app.run(debug=True, port=5000)
