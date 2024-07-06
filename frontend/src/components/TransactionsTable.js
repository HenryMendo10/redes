import React from "react";
import {
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
} from "@chakra-ui/react";
import TransactionItem from "./TransactionItem";

export default function TransactionsTable({ transactions }) {
  return (
    <VStack>
      <Text>Transacciones Recientes</Text>
      <Table size="sm" variant="striped" colorScheme="blackAlpha" id="transactionTable">
        <Thead>
          <Tr>
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
          {transactions.map((tran, index) => (
            <TransactionItem key={index} transaction={tran} />
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
}
