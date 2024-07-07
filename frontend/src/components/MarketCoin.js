import React, { useEffect, useState } from "react";
import axios from "axios";
import TableCoins from "./tablaPrecios/TableCoins"; 

const MarketCoin = () => {
  const [coins, setCoins] = useState([]); // Estado para almacenar las monedas obtenidas de la API
  const [search, setSearch] = useState(""); // Estado para el término de búsqueda

  // Función para obtener datos de la API de CoinGecko
  const getData = async () => {
    try {
      // Realiza la solicitud GET a la API de CoinGecko para obtener las monedas
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      // Actualiza el estado de 'coins' con los datos obtenidos
      setCoins(res.data);
      console.log(res.data); // (opcional)
    } catch (error) {
      console.error(error); // Maneja errores de solicitud o conexión
    }
  };

  // Efecto de lado para cargar los datos al montar el componente
  useEffect(() => {
    getData(); // Llama a la función getData al montar el componente
  }, []); // El segundo argumento vacío [] indica que este efecto solo se ejecuta una vez al montar

  return (
    <div className="container">
      <div className="row">
        {/* Input para buscar criptomonedas */}
        <input
          type="text"
          placeholder="Busca tu Criptomoneda"
          className="form-control bg-dark text-light border-0 mt-4 text-center"
          autoFocus
          onChange={(e) => setSearch(e.target.value)} // Actualiza el estado 'search' al cambiar el valor del input
        />
        {/* Componente TableCoins que muestra la tabla de criptomonedas */}
        <TableCoins coins={coins} search={search} />
      </div>
    </div>
  );
};

export default MarketCoin;
