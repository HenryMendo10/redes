import React from "react";

const CoinRow = ({ coin, index }) => {
  const usdToCrypto = () => {
    if (coin.current_price !== 0) {
      return (1 / coin.current_price).toFixed(6);
    }
    return "N/A";
  };

  return (
    <tr>
      <td>{index}</td>
      <td style={{ display: "flex", alignItems: "center" }}>
        <img
          src={coin.image}
          alt=""
          className="img-fluid me-3"
          style={{ width: "5%" }}
        />
        <div>
          <span>{coin.name}</span>
          <span className="ms-2 text-uppercase" style={{ color: "#a5a9a9" }}>
            {coin.symbol}
          </span>
        </div>
      </td>
      <td>{usdToCrypto()}</td> 
      <td>${coin.current_price.toLocaleString()}</td>
      <td
        className={
          coin.price_change_percentage_24h > 0 ? "text-success" : "text-danger"
        }
      >
        {coin.price_change_percentage_24h}%
      </td>
      <td>${coin.total_volume.toLocaleString()}</td>
      
    </tr>
  );
};

export default CoinRow;
