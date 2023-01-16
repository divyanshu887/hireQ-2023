import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import Detailmodal from "../candidateDetail/candidateDetails";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Link } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";

function JdResult() {
  const { currentUser } = useAuth();

  const [employeeData, setEmployeeData] = useState(null);
  const [row, setRow] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recruiter: currentUser.email.replace(".", ""),
        job_description_ID: "1673739438255-JD1",
      }),
    };

    fetch("http://localhost:9999/searchRelevantCV", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        let rowData = [];
        for (const [key, value] of Object.entries(data["result"])) {
          let temp = {};
          temp.id = key;
          temp.fullName = value["profileData"]["fullName"];
          temp.relevance = value["similarity_score"];
          if (value["contactInfo"]["email"]) {
            temp.email = value["contactInfo"]["email"];
          } else {
            temp.email = "NOT DISCLOSED";
          }
          temp.url = value["contactInfo"]["vanity"];
          rowData.push(temp);
        }
        setRow(rowData);
        setEmployeeData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        fontSize: "2rem",
        marginLeft: "4%",
        marginRight: "4%",
        justifyContent: "center",
      },
    })
  );

  const handleClick = (event, cellValues) => {
    console.log(cellValues.row);
  };

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      width: 250,
    },

    {
      field: "relevance",
      headerName: "Relevance",
      width: 210,
    },
    { field: "email", headerName: "Email", width: "400" },
    {
      field: "Action",
      width: 210,
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              View Detail
            </Button>
          </>
        );
      },
    },
    {
      field: "Source",
      width: 230,
      renderCell: (cellValues) => {
        return <Link href={`https://${cellValues.row.url}`}>Link</Link>;
      },
    },
  ];        
  const classes = useStyles();

  return (
    <div style={{ height: "70vh", width: "100%"}}>
      <div style={{ width: "100%",marginLeft:"40%"}}>
      <Button
              variant="contained"
              color="primary"
              size="large"
              className="ml-5 mb-4"
              // onClick={() => {
              //   setModalOpen(true);
              // }}
            >
              Send Email
            </Button>
      </div>
      
      {modalOpen && <Detailmodal setOpenModal={setModalOpen} />}
      <DataGrid
        rowHeight={70}
        className={classes.root}
        rows={row}
        columns={columns}
        pageSize={7}
        checkboxSelection
        onCellClick={handleCellClick}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default JdResult;
