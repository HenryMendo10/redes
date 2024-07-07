import React from "react";
import {
  Text,          // Componente para texto
  VStack,        // Componente para una pila vertical
  Table,         // Componente para la tabla
  Thead,         // Componente para el encabezado de la tabla
  Tbody,         // Componente para el cuerpo de la tabla
  Tr,            // Componente para una fila de la tabla
  Th,            // Componente para una celda de encabezado
  TableCaption,  // Componente para la leyenda de la tabla
} from "@chakra-ui/react";

import TransactionItem from "./TransactionItem";

// Componente para mostrar la tabla de transacciones
export default function TransactionsTable({ transactions }) {
  return (
    <VStack>
      <Text>Transacciones Recientes</Text>

      {/* Configuración de la tabla */}
      <Table size="sm" variant="striped" colorScheme="blackAlpha" id="transactionTable">
        <Thead>
          <Tr>
            {/* Definición de cada celda de encabezado */}
            <Th textAlign="center">Tipo</Th>
            <Th textAlign="center">Criptomoneda</Th>
            <Th textAlign="center">Importe</Th>
            <Th textAlign="center">Número de Monedas</Th>
            <Th textAlign="center">Precio de Compra</Th>
            <Th textAlign="center">Fecha</Th>
            <Th textAlign="center">Hash</Th>
          </Tr>
        </Thead>

        <Tbody>
          {/* Mapea cada transacción a un componente TransactionItem */}
          {transactions.map((tran, index) => (
            // Pasa la transacción como prop al componente TransactionItem
            <TransactionItem key={index} transaction={tran} />
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}
