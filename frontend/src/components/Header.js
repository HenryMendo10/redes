import React from "react";
import { Link } from "react-router-dom";
import { Flex, Spacer, Heading, Link as ChakraLink } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex bg="gray.800" p={4} align="center">
      <Heading size="md" color="white">
        Proyecto
      </Heading>
      <Spacer />
      <Flex align="center">
        <ChakraLink as={Link} to="/" color="white" mr={4}>
          Inicio
        </ChakraLink>
        <ChakraLink as={Link} to="/Portafolio" color="white" mr={4}>
          Dashboard
        </ChakraLink>
        <ChakraLink as={Link} to="/liveprice" color="white">
          Precio en Vivo
        </ChakraLink>
      </Flex>
    </Flex>
  );
};

export default Header;
