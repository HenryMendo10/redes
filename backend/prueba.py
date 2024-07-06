import hashlib
import time
import json

class Transaccion:
    def __init__(self, remitente, destinatario, cantidad):
        self.remitente = remitente
        self.destinatario = destinatario
        self.cantidad = cantidad

    def __str__(self):
        return json.dumps(self.__dict__)

class Bloque:
    def __init__(self, indice, hash_anterior, marca_tiempo, transacciones, nonce=0):
        self.indice = indice
        self.hash_anterior = hash_anterior
        self.marca_tiempo = marca_tiempo
        self.transacciones = transacciones
        self.nonce = nonce
        self.hash = self.calcular_hash()

    def calcular_hash(self):
        valor = (str(self.indice) + str(self.hash_anterior) + str(self.marca_tiempo) +
                 str([str(tx) for tx in self.transacciones]) + str(self.nonce))
        return hashlib.sha256(valor.encode()).hexdigest()

    def __str__(self):
        transacciones_mostradas = [tx for tx in self.transacciones if tx.remitente != "sistema"]
        return (f"Bloque {self.indice} [marca_tiempo: {self.marca_tiempo}, transacciones: {[str(tx) for tx in transacciones_mostradas]}, "
                f"nonce: {self.nonce}, hash: {self.hash}]")

class CadenaBloques:
    def __init__(self, dificultad):
        self.cadena = [self.crear_bloque_genesis()]
        self.dificultad = dificultad
        self.transacciones_pendientes = []
        self.recompensa_mineria = 50

    def crear_bloque_genesis(self):
        return Bloque(0, "0", int(time.time()), [Transaccion("sistema", "genesis", 0)])

    def obtener_ultimo_bloque(self):
        return self.cadena[-1]

    def minar_transacciones_pendientes(self, direccion_recompensa_mineria):
        transaccion_recompensa = Transaccion("sistema", direccion_recompensa_mineria, self.recompensa_mineria)
        self.transacciones_pendientes.append(transaccion_recompensa)
        nuevo_bloque = Bloque(len(self.cadena), self.obtener_ultimo_bloque().hash, int(time.time()), self.transacciones_pendientes)
        
        self.prueba_trabajo(nuevo_bloque)
        self.cadena.append(nuevo_bloque)
        self.transacciones_pendientes = []

    def agregar_transaccion(self, transaccion):
        if not transaccion.remitente or not transaccion.destinatario or not transaccion.cantidad:
            raise Exception("La transacción debe incluir remitente, destinatario y cantidad")
        self.transacciones_pendientes.append(transaccion)

    def prueba_trabajo(self, bloque):
        max_nonce = 2**64  # Máximo número de nonce
        while True:
            bloque.nonce += 1
            bloque.hash = bloque.calcular_hash()
            if bloque.hash[:self.dificultad] == '0' * self.dificultad:
                return bloque

    def es_cadena_valida(self):
        for i in range(1, len(self.cadena)):
            bloque_actual = self.cadena[i]
            bloque_anterior = self.cadena[i - 1]
            if bloque_actual.hash != bloque_actual.calcular_hash():
                return False
            if bloque_actual.hash_anterior != bloque_anterior.hash:
                return False
        return True

    def __str__(self):
        cadena_str = "" 
        for bloque in self.cadena[1:]:
            cadena_str += str(bloque) + "\n"
        return cadena_str

if __name__ == "__main__":
    blockchain = CadenaBloques(dificultad=4)

    while True:
        print("\nMenú:")
        print("1. Agregar transacción")
        print("2. Minar bloque")
        print("3. Mostrar cadena de bloques")
        print("4. Salir")

        opcion = input("Ingrese la opción deseada: ")

        if opcion == "1":
            remitente = input("Remitente: ")
            destinatario = input("Destinatario: ")
            cantidad = float(input("Cantidad: "))
            transaccion = Transaccion(remitente, destinatario, cantidad)
            blockchain.agregar_transaccion(transaccion)
            print("Transacción agregada.")

        elif opcion == "2":
            direccion_minero = "Minero1"
            blockchain.minar_transacciones_pendientes(direccion_minero)
            print("Bloque minado.")

        elif opcion == "3":
            print("\nCadena de bloques:")
            print(blockchain)

        elif opcion == "4":
            break

        else:
            print("Opción inválida. Por favor, ingrese una opción válida.")
