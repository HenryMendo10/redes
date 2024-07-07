import React, { useState, useEffect } from "react";
import {
  Center,         // Componente para centrar el contenido
  Text,           // Componente para mostrar texto
  Heading,        // Componente para encabezados
  VStack,         // Componente para una pila vertical
  Button,         // Componente para botones
  useDisclosure,  // Hook para el control de estados del modal
  Divider,        // Componente para divisores
} from "@chakra-ui/react";

import TransactionsTable from "./TransactionsTable";  // Tabla de transacciones
import Summary from "./Summary";                      // Resumen del portafolio
import Visualization from "./Visualization";          // Visualización de datos
import AddModal from "./AddModal";                    // Modal para añadir transacciones
import ReactHTMLTableToExcel from "react-html-table-to-excel"; // Exportación a Excel

function Dashboard() {
  // Define estados locales para el componente
  const [transactions, setTransactions] = useState([]);          // Almacena las transacciones
  const [portfolioCost, setPortfolioCost] = useState(0);         // Costo total del portafolio
  const [portfolioValue, setPortfolioValue] = useState(0);       // Valor total del portafolio
  const [absoluteGain, setAbsoluteGain] = useState(0);           // Ganancia absoluta del portafolio
  const [totalGainPercent, setTotalGainPercent] = useState(0);   // Ganancia total porcentual del portafolio
  const [rollups, setRollups] = useState([]);                    // Datos resumidos por criptomoneda
  const { isOpen, onOpen, onClose } = useDisclosure();           // Controla el estado de apertura/cierre del modal

  // Efecto para obtener datos del servidor cuando el modal se abre o cierra
  useEffect(() => {
    // Obtiene los datos resumidos por criptomoneda
    fetch("http://127.0.0.1:5000/get_rollups_by_coin")
      .then((response) => response.json())
      .then((data) => {
        setRollups(data);
        let costAccumulator = 0;
        let valueAccumulator = 0;
        // Calcula el costo y el valor total del portafolio
        data.forEach((item) => {
          costAccumulator += item["total_cost"];
          valueAccumulator += item["total_equity"];
        });
        let absoluteGain = valueAccumulator - costAccumulator;

        setPortfolioCost(costAccumulator);
        setPortfolioValue(valueAccumulator);
        setAbsoluteGain(absoluteGain);
        setTotalGainPercent((absoluteGain / costAccumulator) * 100);
      })
      .catch((error) => console.error("Error rollups:", error));

    // Obtiene las transacciones recientes del servidor
    fetch("http://127.0.0.1:5000/transactions")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => console.error("Error transacciones:", error));
  }, [isOpen]); // Se ejecuta cada vez que cambia el estado de isOpen

  return (
    <Center bg="white" color="black" padding={8}>
      <VStack spacing={7}>
        <Heading>Dashboard de Criptomonedas</Heading>
        <Button size="lg" colorScheme="teal" onClick={onOpen}>
          Añadir Transacción
        </Button>
        <Summary
          portfolioCost={portfolioCost}
          portfolioValue={portfolioValue}
          absoluteGain={absoluteGain}
          totalGainPercent={totalGainPercent}
        />

        <Divider my={4} borderColor="black" />

        <TransactionsTable transactions={transactions} />

        <Divider my={4} borderColor="black" />

        <Visualization rollups={rollups} />
        
        <AddModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

        <Divider my={4} borderColor="black" />

        {/* Botón para exportar la tabla de transacciones a Excel */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <ReactHTMLTableToExcel
            id="botonExportarExcel"
            className="btn btn-success"
            table="transactionTable"  // ID de la tabla a exportar
            filename="Transacciones"  // Nombre del archivo Excel generado
            sheet="pagina 1"          // Nombre de la hoja en el archivo Excel
            buttonText="Exportar a Excel"
            buttonId="exportButton"   // ID del botón de exportación
            buttonClassName="custom-button-class"
            buttonStyle={{ backgroundColor: 'green', color: '#fff', border: 'none' }}
          />
        </div>
      </VStack>
    </Center>
  );
}

export default Dashboard;
