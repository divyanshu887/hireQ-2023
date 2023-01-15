import React, { useState } from 'react'
import MaterialTable from 'material-table'
import {GetAppIcon} from '@material-ui/icons/GetApp';
// import { Button } from '@material-ui/core';

// import * as React from "react";
import { DataGrid } from "@material-ui/data-grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Link } from "@material-ui/core";
import { fontSize } from '@mui/system';


export default  function JdHistory() {
  const [tableData, setTableData] = useState([
    { title: "JD-1", date: "15/01/2023",  },
    { title: "JD-2", date: "15/01/2023",   },
    { title: "JD-3", date: "15/01/2023",   },
    { title: "JD-4", date: "15/01/2023",},
    { title: "JD-5", date: "15/01/2023", },
    { title: "JD-6", date: "15/01/2023",   },
    { title: "JD-7", date: "15/01/2023",    },
    { title: "JD-8", date: "15/01/2023",   },
    { title: "JD-8", date: "15/01/2023",   }
  ])
  const columns = [
    { title: "Title", field: "title", sorting: false, filtering: false, headerStyle: { color: "#fff" } },
    { title: "Date", field: "date", },
    // { title: "Status", field: "status",
    //   lookup: { A: "Accepted", I: "In Process", R : "Rejected" } },
    // emptyValue: () => <em>null</em>,
    // render: (rowData) => <div style={{ background: rowData.status == 'A'? "#008000aa" : "#f90000aa",borderRadius:"4px",paddingLeft:5 }}>{rowData.age >= 18 ? "18+" : "18-"}</div>,
  ]
  return (
    <div className="m-5">

      <MaterialTable columns={columns} data={tableData} 
        editable={{

          onRowUpdate: (newRow, oldRow) => new Promise((resolve, reject) => {
            const updatedData = [...tableData]
            updatedData[oldRow.tableData.id] = newRow
            setTableData(updatedData)
            setTimeout(() => resolve(), 500)
          }),
        }}
        actions={[
          {
            icon: () => <GetAppIcon />,
            tooltip: "Click me",
            onClick: (e, data) => console.log(data),
            // isFreeAction:true
          },
        ]}
        onSelectionChange={(selectedRows) => console.log(selectedRows)}
        components={{
          Action: props => (
            <Button
              onClick={(event) => props.action.onClick(event, props.data)}
              color="primary"
              variant="contained"
              style={{textTransform: 'none'}}
              size="small"
            >
              View Detail
            </Button>
          ),
        }}
        options={{
          sorting: true, search: true,
          searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
           paging: true, pageSizeOptions: [2, 5, 10, 20, 25, 50, 100], pageSize: 5,
          paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
          exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: true,
          showSelectAllCheckbox: true, showTextRowsSelected: false, 
          grouping: true, columnsButton: true,
          rowStyle: (data, index) => index % 2 === 0 ? { background: "#f5f5f5" } : null,
          headerStyle: { background: "#f44336",color:"#fff"}
        }}
        title="Job Descriptions"
         />
    </div>
  )
}







// const useStyles = makeStyles((theme) =>
//   createStyles({
//     root: {
//       fontSize:'2rem',
//       marginLeft:'4%',
//       marginRight:'4%',
//     }
//   })
// );

// const handleClick = (event, cellValues) => {
//   console.log(cellValues.row);
// };

// const handleCellClick = (param, event) => {
//   event.stopPropagation();
// };

// const handleRowClick = (param, event) => {
//   event.stopPropagation();
// };

// const columns = [
//   {
//     field: "name",
//     headerName: "Name",
//     width: 350,
//     fontSize:'40px',
//   },
//   { field: "email", headerName: "Email", width: "500" },
//   {
//     field: "Action",
//     width: 250,
//     renderCell: (cellValues) => {
//       return (
//         <Button
//           variant="contained"
//           color="primary"
//           size="large"
//           onClick={(event) => {
//             handleClick(event, cellValues);
//           }}
//         >
//           View Detail
//         </Button>
//       );
//     }
//   },
//   {
//     field: "Source",
//     width: 250,
//     renderCell: (cellValues) => {
//       return <Link href={`#${cellValues.row.url}`}>Link</Link>;
//     }
//   }
// ];

// const rows = [
//   { id: 1, name: "Snow", email: "abc@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
//   { id: 2, name: "Lannister", email: "test1@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
//   { id: 3, name: "Snow", email: "abc@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
//   { id: 4, name: "Lannister", email: "test1@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
//   { id: 5, name: "Snow", email: "abc@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
//   { id: 6, name: "Lannister", email: "test1@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
  
// ];

// export default function JdHistory() {
//   const classes = useStyles();

//   return (
//     <div style={{ height: "80vh", width: "100%" }}>
//       <DataGrid
//         rowHeight={70}
//         className={classes.root}
//         rows={rows}
//         columns={columns}
//         pageSize={5}
//         checkboxSelection
//         onCellClick={handleCellClick}
//         onRowClick={handleRowClick}
//       />
//     </div>
//   );
// }
