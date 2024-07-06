import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  VStack,
  HStack,
  Center,
} from "@chakra-ui/react";

import teamIntroImage from "../images/1.jpg";
import integrante1 from "../images/integrante1.jpg";



const HomePage = () => {

  return (
    <Box p={8}>

      <Box bg="black" color="white" py={4} px={8} mb={8} borderRadius="md">
        <Heading size="xl">PROYECTO - REDES DE COMPUTADORAS</Heading>
      </Box>


      <Flex
        bg="gray.200"
        p={8}
        borderRadius="md"
        alignItems="center"
        justifyContent="space-between"
        mb={8}
      >
        <Box flex="1" mr={8}>
          <Heading fontsize={20} mb={4}>
            Acerca del Proyecto
          </Heading>
          <Text fontSize={20}>
          Este proyecto permite a los usuarios gestionar un portafolio de inversiones en diversas criptomonedas. Los usuarios pueden realizar inversiones y realizar un seguimiento de su desempeño a través de gráficos que muestran el valor actual de sus inversiones y cualquier cambio en su valoración. Cada transacción está asegurada mediante un código hash, garantizando la seguridad y la integridad de los datos gracias a su encriptación.
          </Text>
        </Box>
        <Box flex="1">
          <Image
            src={teamIntroImage}
            alt="Equipo"
            borderRadius="md"
            objectFit="cover"
            boxSize="full"
          />
        </Box>
      </Flex>


      <VStack 
        spacing={4} 

        bg="gray.200"
        p={8}
        borderRadius="md"
        alignItems="center"
        justifyContent="space-between"
        >
        <Heading size="lg" mb={1} color="black">
          Nuestro Equipo
        </Heading>

        <HStack spacing={10}
        p={8}
        borderRadius="md"
        alignItems="center"
        justifyContent="space-between">
          <Center
            flexDirection="column"
          >
            <Image
              src={integrante1}
              alt="Miembro 1"
              boxSize="200px"
              mb={2}
            />
            <Text textAlign="center">Fabricio Lagos</Text>
          </Center>

          <Center
            flexDirection="column"
          >
            <Image
              src={integrante1}
              alt="Miembro 1"
              boxSize="200px"
              mb={2}
            />
            <Text textAlign="center">Fabricio Lagos</Text>
          </Center>

          <Center
            flexDirection="column"
          >
            <Image
              src={integrante1}
              alt="Miembro 1"
              boxSize="200px"
              mb={2}
            />
            <Text textAlign="center">Fabricio Lagos</Text>
          </Center>

          <Center
            flexDirection="column"
          >
            <Image
              src={integrante1}
              alt="Miembro 1"
              boxSize="200px"
              mb={2}
            />
            <Text textAlign="center">Fabricio Lagos</Text>
          </Center>
        </HStack>
      </VStack>

      {/* Otra Sección, etc. */}
    </Box>
  );
};

export default HomePage;
