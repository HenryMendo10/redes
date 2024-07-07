import React from "react";
// Importa componentes de Chakra UI para el diseño
import { Center, Text, VStack, HStack } from "@chakra-ui/react";

// Importa componentes de Recharts para la creación de gráficos
import {
  PieChart,  // Componente para gráficos de pastel
  Pie,       // Componente para secciones del gráfico de pastel
  BarChart,  // Componente para gráficos de barras
  Bar,       // Componente para una serie de datos en el gráfico de barras
  Cell,      // Componente para una celda en los gráficos de pastel y barras
  XAxis,     // Componente para el eje X
  YAxis,     // Componente para el eje Y
  Tooltip,   // Componente para mostrar información al pasar el ratón
  Legend,    // Componente para mostrar la leyenda del gráfico
} from "recharts";

// Define una lista de colores para los gráficos
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#F28042",
  "#9fd3c7",
  "#142d4c",
  "#feff9a",
  "#ffb6b9",
  "#fae3d9",
  "#bbded6",
  "#61c0bf",
];

// Componente de visualización que recibe rollups como prop
export default function Visualization({ rollups }) {
  return (
    <Center>
      {/* Organiza el contenido en una pila vertical */}
      <VStack>


        <Text>Costo vs Capital</Text>
        {/* Configuración del gráfico de barras */}
        <BarChart
          width={600}    // Ancho del gráfico
          height={300}   // Alto del gráfico
          data={rollups} // Datos a visualizar
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* Configuración del eje X */}
          <XAxis dataKey="symbol" />
          {/* Configuración del eje Y */}
          <YAxis />
          {/* Configuración del tooltip */}
          <Tooltip />
          {/* Configuración de la leyenda */}
          <Legend />
          {/* Serie de datos para el capital total */}
          <Bar dataKey="total_equity" fill="#00C49F" />
          {/* Serie de datos para el costo total */}
          <Bar dataKey="total_cost" fill="#FFBB28" />
        </BarChart>

        {/* Organiza los gráficos de pastel en una fila horizontal */}
        <HStack>
          <VStack>
            <Text>Distribucion de Costo </Text>
            {/* Configuración del gráfico de pastel */}
            <PieChart width={250} height={250}>
              <Pie data={rollups} dataKey="total_cost" nameKey="symbol">
                {/* Mapea los datos a las celdas del gráfico de pastel */}
                {rollups.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* Configuración de la leyenda */}
              <Legend></Legend>
              {/* Configuración del tooltip */}
              <Tooltip></Tooltip>
            </PieChart>
          </VStack>


          <VStack>

            <Text>Distribucion de Capital</Text>
            {/* Configuración del gráfico circular */}
            <PieChart width={250} height={250}>

              <Pie data={rollups} dataKey="total_equity" nameKey="symbol">
                {/* Mapea los datos a las celdas del gráfico circular*/}
                {rollups.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* Configuración de la leyenda */}
              <Legend></Legend>
              {/* Configuración del tooltip */}
              <Tooltip></Tooltip>
            </PieChart>
          </VStack>
        </HStack>
      </VStack>
    </Center>
  );
}
