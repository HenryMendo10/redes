import React from "react";
// Importa componentes de Chakra UI para el diseño
import { Container, Text, VStack, HStack } from "@chakra-ui/react";

// Componente para mostrar el resumen del portafolio
export default function Summary({
  portfolioCost,       // Costo total del portafolio
  portfolioValue,      // Valor total del portafolio
  absoluteGain,        // Ganancia o pérdida absoluta
  totalGainPercent,    // Porcentaje de ganancia o pérdida
}) {
  return (
    // Organiza los contenedores en una fila horizontal con espacio entre ellos
    <HStack spacing={6}>


      {/* Contenedor para mostrar el costo del portafolio */}
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>

        {/* Organiza el contenido en una pila vertical */}
        <VStack width={40} spacing={2}>
          {/* Muestra el costo del portafolio, formateado con comas */}
          <Text fontSize="2xl">
            $ {Number(portfolioCost.toFixed(2)).toLocaleString()}
          </Text>

          <Text fontSize="xs" size="md">
            Valor Invertido
          </Text>
        </VStack>
      </Container>


      {/* Contenedor para mostrar el valor del portafolio */}
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>

        {/* Organiza el contenido en una pila vertical */}
        <VStack width={40} spacing={2}>
          {/* Muestra el valor del portafolio, formateado con comas */}
          <Text fontSize="2xl">
            $ {Number(portfolioValue.toFixed(2)).toLocaleString()}
          </Text>
          {/* Texto descriptivo */}
          <Text fontSize="xs">Valor Portafolio</Text>
        </VStack>

      </Container>


      {/* Contenedor para mostrar la ganancia o pérdida absoluta */}
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>
        {/* Organiza el contenido en una pila vertical */}
        <VStack width={40} spacing={2}>
          {/* Muestra la ganancia o pérdida absoluta, formateada con comas */}
          <Text fontSize="2xl">
            $ {Number(absoluteGain.toFixed(2)).toLocaleString()}
          </Text>
          {/* Texto descriptivo */}
          <Text fontSize="xs">Ganancia / Pérdida absoluta</Text>
        </VStack>
      </Container>


      {/* Contenedor para mostrar el porcentaje de ganancia o pérdida */}
      <Container bg="gray.200" borderRadius="md" p={4} m={2}>
        {/* Organiza el contenido en una pila vertical */}
        <VStack width={40} spacing={2}>
          {/* Muestra el porcentaje de ganancia o pérdida */}
          <Text fontSize="2xl">{totalGainPercent.toFixed(2)} %</Text>
          {/* Texto descriptivo */}
          <Text fontSize="xs">Ganancia / Pérdida %</Text>
        </VStack>
      </Container>

      
    </HStack>
  );
}
