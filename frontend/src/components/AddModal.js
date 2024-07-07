// useState para el estado del componente
import React, { useState } from "react";

// Importa componentes de Chakra UI para el diseño de la interfaz
import {
  Modal,             // Componente para la ventana modal
  ModalOverlay,      // Componente para el fondo de la ventana modal
  ModalContent,      // Componente para el contenido de la ventana modal
  ModalHeader,       // Componente para el encabezado de la ventana modal
  ModalFooter,       // Componente para el pie de página de la ventana modal
  ModalBody,         // Componente para el cuerpo de la ventana modal
  ModalCloseButton,  // Componente para el botón de cierre de la ventana modal
  VStack,            // Componente para una pila vertical
  Button,            // Componente para un botón
  Input,             // Componente para un campo de entrada de texto
  Select,            // Componente para un campo de selección
} from "@chakra-ui/react";

// Componente para añadir una transacción a través de un modal
export default function AddModal({ isOpen, onClose }) {
  // Define estados locales para los campos del formulario
  const [type, setType] = useState("");                          // Estado para el tipo de transacción
  const [name, setName] = useState("");                          // Estado para el nombre de la criptomoneda
  const [symbol, setSymbol] = useState("");                      // Estado para el símbolo de la criptomoneda
  const [amount, setAmount] = useState("");                      // Estado para el importe de la transacción
  const [pricePurchasedAt, setPricePurchasedAt] = useState("");  // Estado para el precio de compra
  const [transactionDate, setTransactionDate] = useState("");    // Estado para la fecha de la transacción
  const [numberOfCoins, setNumberOfCoins] = useState("");        // Estado para el número de monedas

  // Función para añadir una transacción
  const addTransaction = () => {
    // Crea un objeto con los datos de la transacción y lo convierte a una cadena JSON
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
    console.log(payload); // Muestra el payload en la consola

    // Envía una solicitud POST para añadir la transacción
    fetch("http://127.0.0.1:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((response) => response.json()) // Convierte la respuesta a JSON
      .then((data) => {
        onClose(); // Cierra el modal después de añadir la transacción
      });
  };

  return (
    <>
      {/* Modal que se muestra cuando isOpen es true */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">

        {/* Fondo del modal */}
        <ModalOverlay />
        {/* Contenido del modal */}
        <ModalContent>
          {/* Encabezado del modal */}
          <ModalHeader>Añadir Transacción</ModalHeader>

          {/* Botón para cerrar el modal */}
          <ModalCloseButton />
          
          {/* Cuerpo del modal */}
          <ModalBody>
            {/* Contenedor vertical para los campos del formulario */}
            <VStack spacing={8}>
              {/* Campo de selección para el tipo de transacción */}
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

              {/* Campo de selección para el nombre de la criptomoneda */}
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

              {/* Campo de selección para el símbolo de la criptomoneda */}
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

              {/* Campo de entrada para el importe de la transacción */}
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Importe"
              />

              {/* Campo de entrada para el número de monedas */}
              <Input
                value={numberOfCoins}
                onChange={(e) => setNumberOfCoins(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Número de Monedas"
              />

              {/* Campo de entrada para el precio de compra */}
              <Input
                value={pricePurchasedAt}
                onChange={(e) => setPricePurchasedAt(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Precio de Compra"
              />

              {/* Campo de entrada para la fecha de la transacción */}
              <Input
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                focusBorderColor="teal"
                variant="flushed"
                placeholder="Fecha (MM-DD-YYYY)"
              />
            </VStack>
          </ModalBody>
          {/* Pie de página del modal */}
          <ModalFooter>
            {/* Botón para añadir la transacción */}
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
