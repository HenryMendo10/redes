import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Dashboard from "../Dashboard";
import Header from "../Header";

function Portafolio() {
  return (
    <ChakraProvider>
      <Header />
      <Dashboard />
    </ChakraProvider>
  );
}

export default Portafolio;
