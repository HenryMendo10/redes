import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "../Header";
import MarketCoin from "../MarketCoin";

function LivePrice() {
  return (
    <ChakraProvider>
      <Header />
      <MarketCoin />
    </ChakraProvider>
  );
}

export default LivePrice;
