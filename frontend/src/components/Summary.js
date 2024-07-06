import React from "react";
import { Container, Text, VStack, HStack } from "@chakra-ui/react";

export default function Summary({
  portfolioCost,
  portfolioValue,
  absoluteGain,
  totalGainPercent,
}) {
  return (
    <HStack spacing={6}>
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>
        <VStack width={40} spacing={2}>
          <Text fontSize="2xl">
            $ {Number(portfolioCost.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md">
            Valor Invertido
          </Text>
        </VStack>
      </Container>
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>
        <VStack width={40} spacing={2}>
          <Text fontSize="2xl">
            $ {Number(portfolioValue.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs">Valor Portafolio</Text>
        </VStack>
      </Container>
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>
        <VStack width={40} spacing={2}>
          <Text fontSize="2xl">
            $ {Number(absoluteGain.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs">Ganancia / Pérdida absoluta</Text>
        </VStack>
      </Container>
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>
        <VStack width={40} spacing={2}>
          <Text fontSize="2xl">{totalGainPercent.toFixed(2)} %</Text>
          <Text fontSize="xs">Ganancia / Pérdida %</Text>
        </VStack>
      </Container>

    </HStack>
  );
}