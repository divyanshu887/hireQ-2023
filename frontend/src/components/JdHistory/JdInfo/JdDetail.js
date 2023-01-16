import "./JdDetail.css";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Jdmodal({ setOpenModal,jdData }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>JD ID : {jdData.id}</h1> 
        </div>
        <div className="body">
        <h5>Description : {jdData.description}</h5> 
        </div>
      </div>
    </div>
  );
}
export default Jdmodal


