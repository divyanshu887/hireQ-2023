import "./candidateDetails.css";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

function Detailmodal({ setOpenModal, empData }) {
  console.log(empData);
  let description = "";
  let skills = "";
  if (empData.source === "linkedin") {
    description = empData["profileData"]["description"];
    skills = empData["skills"];
  } else if (empData.source === "upwork") {
    description = empData["description"];
    skills = empData["skills"];
  }

  console.log(description);

  return (
    <div className="modalBackground">
      <div className="modalCont">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <ul className="row">
          {skills.map((d) => (
            <li key={d}>{d}</li>
          ))}

          {/* <h5>Skills : {skills}</h5> */}
        </ul>
        <div className="row">
          <h5>Description : {description}</h5>
        </div>
      </div>
    </div>
  );
}
export default Detailmodal;
