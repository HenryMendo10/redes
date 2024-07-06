import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "../Header";
import HomePage from "../HomePage";

function Inicio() {
  return (
    <ChakraProvider>
      <Header />
      <HomePage />
    </ChakraProvider>
  );
}

export default Inicio;
