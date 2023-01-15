import React from 'react';
import { DataGrid } from "@material-ui/data-grid";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Button, Link } from "@material-ui/core";

function JdResult() {

const useStyles = makeStyles((theme) =>
createStyles({
  root: {
    fontSize:'2rem',
    marginLeft:'4%',
    marginRight:'4%',
    justifyContent: 'center',
  }
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
    field: "firstName",
    headerName: "First Name",
    width: 250,
    
  },
{
  field: "lastName",
  headerName: "Last Name",
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
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={(event) => {
          handleClick(event, cellValues);
        }}
      >
        View Detail
      </Button>
    );
  }
},
{
  field: "Source",
  width: 230,
  renderCell: (cellValues) => {
    return <Link href={`#${cellValues.row.url}`}>Link</Link>;
  }
}
];

const rows = [
{ id: 1, firstName:"Jon",lastName: "Snow", relevance:"5",email: "abc@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 2, firstName:"Tyrinn",lastName: "Lannister",relevance:"5", email: "test1@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 3, firstName:"Jon" ,lastName: "Snow", relevance:"5",email: "abc3@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 4, firstName:"Tyrinn",lastName: "Lannister",relevance:"5", email: "test4@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 5, firstName:"Jon",lastName: "Snow",relevance:"5", email: "abc5@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 6, firstName:"Tyrinn",lastName: "Lannister",relevance:"5", email: "test6@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 7, firstName:"Jon",lastName: "Snow", relevance:"5",email: "abc7@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 8, firstName:"Tyrinn",lastName: "Lannister",relevance:"5", email: "test8@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 9, firstName:"Jon" ,lastName: "Snow", relevance:"5",email: "abc9@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 10, firstName:"Tyrinn",lastName: "Lannister",relevance:"5", email: "test10@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 11, firstName:"Jon",lastName: "Snow", relevance:"5",relevance:"5",email: "abc11@gmail.com", url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },
{ id: 12, firstName:"Tyrinn",lastName: "Lannister",relevance:"5", email: "test12@gmail.com",url: "https://www.linkedin.com/in/divyanshu-singh-486772195/" },

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
      <DataGrid
        rowHeight={70}
        className={classes.root}
        rows={rows}
        columns={columns}
        pageSize={7}
        checkboxSelection
        onCellClick={handleCellClick}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default JdResult
