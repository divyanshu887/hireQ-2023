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

  // const [tableData, setTableData] = useState([
  //   { name: "Raj", email: "Raj@gmail.com", status: "A",  },
  //   { name: "Mohan", email: "mohan@gmail.com", status: "I",  },
  //   { name: "Sweety", email: "sweety@gmail.com", status: "A",   },
  //   { name: "Vikas", email: "vikas@gmail.com", status: "R",  },
  //   { name: "Neha", email: "neha@gmail.com", status: "I", },
  //   { name: "Mohan", email: "mohan@gmail.com", status: "A",   },
  //   { name: "Sweety", email: "sweety@gmail.com", status: "A",   },
  //   { name: "Vikas", email: "vikas@gmail.com", status: "R",  },
  //   { name: "Raj", email: "Raj@gmail.com", status: "R",  },
  //   { name: "Mohan", email: "mohan@gmail.com", status: "I",  },
  //   { name: "Sweety", email: "sweety@gmail.com",status: "I",   },
  //   { name: "Vikas", email: "vikas@gmail.com", status: "I",   },
  // ])
  // const columns = [
  //   { title: "Name", field: "name", sorting: false, filtering: false, headerStyle: { color: "#fff" } },
  //   {
  //     field: "Print",
  //     renderCell: (cellValues) => {
  //       return (
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           onClick={(event) => {
  //             // handleClick(event, cellValues);
  //           }}
  //         >
  //           Print
  //         </Button>
  //       );
  //     }
  //   },
  //   { title: "Email", field: "email", filterPlaceholder: "filter" },
  //   { title: "Status", field: "status",
  //     lookup: { A: "Accepted", I: "In Process", R : "Rejected" } },
  //   // emptyValue: () => <em>null</em>,
  //   // render: (rowData) => <div style={{ background: rowData.status == 'A'? "#008000aa" : "#f90000aa",borderRadius:"4px",paddingLeft:5 }}>{rowData.age >= 18 ? "18+" : "18-"}</div>,
  // ]
  // return (
  //   <div  className="m-5">

  //     <MaterialTable columns={columns} data={tableData}
  //       editable={{

  //         onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
  //           const updatedData = [...tableData]
  //           updatedData[oldRow.tableData.id] = newRow
  //           setTableData(updatedData)
  //           setTimeout(() => resolve(), 500)
  //         }),
  //       }}
  //       actions={[
  //         {
  //           icon: () => <GetAppIcon />,
  //           tooltip: "Click me",
  //           onClick: (e, data) => console.log(data),
  //           // isFreeAction:true
  //         },

  //       ]}
  //       components={{
  //         Action: props => (
  //           <Button
  //             onClick={(event) => props.action.onClick(event, props.data)}
  //             color="primary"
  //             variant="contained"
  //             style={{textTransform: 'none'}}
  //             size="small"
  //           >
  //             View Result
  //           </Button>
  //         ),
  //       }}
  //       onSelectionChange={(selectedRows) => console.log(selectedRows)}
  //       options={{
  //         sorting: true, search: true,
  //         searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
  //         filtering: true, paging: true, pageSizeOptions: [2, 5, 10, 20, 25, 50, 100], pageSize: 5,
  //         paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
  //         exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: true,
  //         showSelectAllCheckbox: true, showTextRowsSelected: false,
  //         grouping: true, columnsButton: true,
  //         rowStyle: (data, index) => index % 2 === 0 ? { background: "#f5f5f5" } : null,
  //         headerStyle: { background: "#f44336",color:"#fff"}
  //       }}
  //       title="Shortlisted Candidate Information"
  //        />
  //   </div>
  // )
  const classes = useStyles();

  return (
    <div style={{ height: "70vh", width: "100%" }}>
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
