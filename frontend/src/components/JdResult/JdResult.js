import React, { useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import axios from "axios";
import Detailmodal from "../candidateDetail/candidateDetails";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Link } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../utils/Notification";
import { CssBaseline, createTheme, ThemeProvider } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";

const theme = createTheme({
  typography: {
    fontSize: 26,
  },

  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});

const useStyles = makeStyles({
  root: {
    fontSize: 26,
    marginLeft: "4%",
    marginRight: "4%",
    justifyContent: "center",
  },
});

function JdResult() {
  const { currentUser, logout } = useAuth();
  const params = useParams();
  console.log("u", params);

  const history = useHistory();

  const [employeeData, setEmployeeData] = useState(null);
  const [row, setRow] = useState([]);
  const [modaldata, setModalData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recruiter: currentUser.email.replace(".", ""),
        job_description_ID: params["jdname"],
      }),
    };

    fetch("http://localhost:9999/searchRelevantCV", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let rowData = [];
        for (const [key, value] of Object.entries(data["result"])) {
          let temp = {};
          temp.id = key;
          if (value.source === "linkedin") {
            temp.fullName = value["profileData"]["fullName"];
            temp.relevance = value["similarity_score"];
            if (value["contactInfo"]["email"]) {
              temp.email = value["contactInfo"]["email"];
            } else {
              temp.email = "NOT DISCLOSED";
            }
            temp.url = value["profileData"]["url"];
          } else if (value.source === "upwork") {
            temp.fullName = value["fullname"];
            temp.relevance = value["similarity_score"];
            temp.email = "NOT DISCLOSED";
            temp.url = value["url"];
          } else {
            continue;
          }

          rowData.push(temp);
        }
        setRow(rowData);
        setEmployeeData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleMailClick = (e) => {
    if (selectionModel.length > 0) {
      console.log("sent successfully", selectionModel);
      const mails = [];
      for (let i = 0; i < selectionModel.length; i += 1) {
        const usrdata = employeeData["result"][selectionModel[i]];
        console.log(usrdata);
        if (usrdata.source === "linkedin") {
          if (usrdata["contactInfo"]["email"]) {
            mails.push(usrdata["contactInfo"]["email"]);
          } else {
            mails.push("harshm17172612@gmail.com");
          }
        } else if (usrdata.source === "upwork") {
          mails.push("harshm17172612@gmail.com");
        }
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          userMail: mails,
        }),
      };

      fetch("http://localhost:5000/api/requestMail", requestOptions)
        .then(async (res) => {
          if (res.status === 401) {
            await logout();
          }

          return res.json();
        })
        .then((data) => {
          console.log(data);
          setNotify({
            isOpen: true,
            message: "Mail Sent Successfully",
            type: "success",
          });
        })
        .catch((err) => {
          console.log(err);
          setNotify({
            isOpen: true,
            message: "Some Error Occured",
            type: "error",
          });
          if (err.statusCode === 401) {
            history.replace("/login");
          }
        });
    }
  };

  const handleClick = (event, cellValues) => {
    console.log(cellValues.row);
  };

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    console.log(event);
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
              id={cellValues.row.id}
              onClick={(e) => {
                console.log(e.target, e.target.id, cellValues.row.id);
                setModalOpen(true);
                setModalData(employeeData["result"][cellValues.row.id]);
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
        return <Link href={`${cellValues.row.url}`}>Link</Link>;
      },
    },
  ];
  const classes = useStyles();
  console.log(selectionModel, employeeData, row);
  console.log(modaldata);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: "70vh" }}>
        <Notification notify={notify} setNotify={setNotify} />
        <div style={{ marginLeft: "40%" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="ml-5 mb-4"
            onClick={handleMailClick}
          >
            Send Email
          </Button>
        </div>

        {modalOpen && (
          <Detailmodal setOpenModal={setModalOpen} empData={modaldata} />
        )}
        <DataGrid
          rowHeight={70}
          className={classes.root}
          rows={row}
          columns={columns}
          pageSize={7}
          checkboxSelection
          onCellClick={handleCellClick}
          onRowClick={handleRowClick}
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          selectionModel={selectionModel}
        />
      </div>
    </ThemeProvider>
  );
}

export default JdResult;
