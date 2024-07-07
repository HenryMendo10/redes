import React from "react";

const CoinRow = ({ coin, index }) => {
  // Función para calcular el valor de 1 USD en la criptomoneda actual
  const usdToCrypto = () => {
    if (coin.current_price !== 0) {
      return (1 / coin.current_price).toFixed(6);  // Calcula el valor y lo redondea a 6 decimales
    }
    return "N/A";  // Devuelve "N/A" si el precio actual es 0
  };

  return (
    <tr>
      <td>{index}</td> {/* Muestra el índice de la fila */}
      <td style={{ display: "flex", alignItems: "center" }}>
        <img
          src={coin.image}  // Muestra la imagen de la criptomoneda
          alt=""
          className="img-fluid me-3"
          style={{ width: "5%" }}  // Establece el ancho de la imagen
        />
        <div>
          <span>{coin.name}</span>  {/* Muestra el nombre de la criptomoneda */}
          <span className="ms-2 text-uppercase" style={{ color: "#a5a9a9" }}>
            {coin.symbol}
          </span>  {/* Muestra el símbolo de la criptomoneda */}
        </div>
      </td>
      <td>{usdToCrypto()}</td>  {/* Muestra el valor de 1 USD en la criptomoneda actual */}
      <td>${coin.current_price.toLocaleString()}</td>  {/* Muestra el precio actual de la criptomoneda formateado como moneda */}
      <td
        className={
          coin.price_change_percentage_24h > 0 ? "text-success" : "text-danger"
        }
      >
        {coin.price_change_percentage_24h}%  {/* Muestra el cambio porcentual en el precio en las últimas 24 horas */}
      </td>
      <td>${coin.total_volume.toLocaleString()}</td>  {/* Muestra el volumen total de transacciones */}
    </tr>
  );
};

export default CoinRow;
