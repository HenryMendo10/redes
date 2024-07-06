import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Input,
  Select,
} from "@chakra-ui/react";

export default function AddModal({ isOpen, onClose }) {
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [pricePurchasedAt, setPricePurchasedAt] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [numberOfCoins, setNumberOfCoins] = useState("");

  const addTransaction = () => {
    const payload = JSON.stringify({
      name: name,
      symbol: symbol,
      type: type,
      amount: amount * 100,
      price_purchased_at: pricePurchasedAt,
      time_created: Date.now() / 1000,
      time_transacted: Date.parse(transactionDate) / 1000,
      no_of_coins: numberOfCoins,
    });
    console.log(payload);
    fetch("http://127.0.0.1:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        onClose();
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Añadir Transacción</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8}>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              focusBorderColor="teal"
              variant="flushed"
              placeholder="Seleccione Compra = [1] , Venta = [2]:"
            >
              <option value="1">Compra [1]</option>
              <option value="2">Venta [2]</option>
            </Select>

            <Select
              value={name}
              onChange={(e) => setName(e.target.value)}
              focusBorderColor="teal"
              variant="flushed"
              placeholder="Selecciona la criptomoneda"
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="solana">Solana</option>
              <option value="chainlink">Chainlink</option>
              <option value="ethereum">Ethereum</option>
              <option value="cardano">Cardano</option>
              <option value="decentraland">Decentraland</option>
            </Select>
            <Select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              focusBorderColor="teal"
              variant="flushed"
              placeholder="Selecciona el símbolo"
            >
              <option value="BTC">BTC (Bitcoin)</option>
              <option value="SOL">SOL (Solana)</option>
              <option value="LINK">LINK (Chainlink)</option>
              <option value="ETH">ETH (Ethereum)</option>
              <option value="ADA">ADA (Cardano)</option>
              <option value="MANA">MANA (Decentraland)</option>
            </Select>

              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Importe"
              />

              <Input
                value={numberOfCoins}
                onChange={(e) => setNumberOfCoins(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Precio en 1$"
              />
              <Input
                value={pricePurchasedAt}
                onChange={(e) => setPricePurchasedAt(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Precio de Compra"
              />
              <Input
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Fecha (MM-DD-YYYY)"
              />
              
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              bg="teal"
              color="white"
              mr={3}
              size="lg"
              onClick={addTransaction}
            >
              Add Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}