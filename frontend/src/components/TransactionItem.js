import React from "react";
import { Tr, Td } from "@chakra-ui/react";

// Componente para representar un ítem de transacción
export default function TransactionItem({ transaction }) {
  return (
    <Tr>

      <Td textAlign="center">{transaction["type"]}</Td>

      <Td textAlign="center">{transaction["symbol"]}</Td>
      <Td isNumeric style={{ textAlign: 'center' }}>$ {transaction["amount"].toLocaleString()}</Td>
      <Td isNumeric style={{ textAlign: 'center' }}>{transaction["no_of_coins"]}</Td>
      <Td isNumeric style={{ textAlign: 'center' }}>$ {transaction["price_purchased_at"].toLocaleString()}</Td>
      <Td isNumeric style={{ textAlign: 'center' }}>{transaction["time_transacted"]}</Td>
      <Td isNumeric style={{ textAlign: 'center' }}>{transaction["hash"]}</Td>
    </Tr>
  );
}
