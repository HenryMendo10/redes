import React from "react";
import CoinRow from "./CoinRow"; 

// Títulos de las columnas de la tabla
const titles = ["#", "Criptomoneda", "Precio $1", "Precio", "Variación", "Volumen 24h"];

const TableCoins = ({ coins, search }) => {
  // Filtra las monedas según el término de búsqueda
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Si no hay monedas, muestra un mensaje
  if (!coins) return <div>no hay monedas</div>;

  return (
    <table className="table table-dark mt-4 table-hover">
      <thead>
        <tr>
          {/* Renderiza los títulos de las columnas */}
          {titles.map((title, index) => (
            <th key={index}>{title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Renderiza cada fila de moneda filtrada como componente CoinRow */}
        {filteredCoins.map((coin, index) => (
          <CoinRow key={coin.id} coin={coin} index={index + 1} />
        ))}
      </tbody>
    </table>
  );
};

export default TableCoins;
