import hashlib
import json
from datetime import datetime
from logic import Transaction

class Bloque:
    def __init__(self, indice, marca_de_tiempo, transacciones=None, nonce=0, hash_anterior=''):
        self.indice = indice
        self.marca_de_tiempo = marca_de_tiempo
        self.transacciones = transacciones if transacciones else []
        self.nonce = nonce
        self.hash_anterior = hash_anterior
        self.hash = self.calcular_hash()

    def calcular_hash(self):
        transacciones_hashes = [tx.calcular_hash() for tx in self.transacciones]
        bloque_str = json.dumps({
            "indice": self.indice,
            "marca_de_tiempo": self.marca_de_tiempo,
            "transacciones": transacciones_hashes,
            "nonce": self.nonce,
            "hash_anterior": self.hash_anterior
        }, sort_keys=True).encode()
        return hashlib.sha256(bloque_str).hexdigest()

    def minar_bloque(self, dificultad):
        patron_objetivo = '0' * dificultad
        while not self.hash.startswith(patron_objetivo):
            self.nonce += 1
            self.hash = self.calcular_hash()

class CadenaBloques:
    def __init__(self, dificultad):
        self.cadena = [self.crear_bloque_genesis()]
        self.dificultad = dificultad

    def crear_bloque_genesis(self):
        return Bloque(0, int(datetime.now().timestamp()), [])

    def obtener_ultimo_bloque(self):
        return self.cadena[-1]

    def agregar_transaccion(self, transaccion):
        self.obtener_ultimo_bloque().transacciones.append(transaccion)

    def minar_transacciones_pendientes(self, minero):
        ultimo_bloque = self.obtener_ultimo_bloque()
        nuevo_bloque = Bloque(
            indice=ultimo_bloque.indice + 1,
            marca_de_tiempo=int(datetime.now().timestamp()),
            transacciones=ultimo_bloque.transacciones,
            nonce=0,
            hash_anterior=ultimo_bloque.hash
        )
        nuevo_bloque.minar_bloque(self.dificultad)
        self.cadena.append(nuevo_bloque)
