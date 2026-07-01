import React from "react";

export default function ImageMessage({ image }) {

  return (

    <img
      src={image}
      alt="chat"
      style={{
        width: 180,
        borderRadius: 10,
      }}
    />

  );

}
