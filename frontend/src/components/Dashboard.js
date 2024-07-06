import React, { useState, useEffect } from "react";
import {
  Center,
  Text,
  Heading,
  VStack,
  Button,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";


import TransactionsTable from "./TransactionsTable";
import Summary from "./Summary";
import Visualization from "./Visualization";
import AddModal from "./AddModal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [portfolioCost, setPortfolioCost] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [absoluteGain, setAbsoluteGain] = useState(0);
  const [totalGainPercent, setTotalGainPercent] = useState(0);
  const [rollups, setRollups] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_rollups_by_coin")
      .then((response) => response.json())
      .then((data) => {
        setRollups(data);
        let costAccumulator = 0;
        let valueAccumulator = 0;
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

    fetch("http://127.0.0.1:5000/transactions")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => console.error("Error transacciones:", error));
  }, [isOpen]);

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

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <ReactHTMLTableToExcel
              id="botonExportarExcel"
              className="btn btn-success"
              table="transactionTable"
              filename="Transacciones"
              sheet="pagina 1"
              buttonText="Exportar a Excel"
              buttonId="exportButton" 
              buttonClassName="custom-button-class" 
              buttonStyle={{ backgroundColor: 'green', color: '#fff', border: 'none' }}
            />
        </div>
      </VStack>
    </Center>
  );
}

export default Dashboard;
