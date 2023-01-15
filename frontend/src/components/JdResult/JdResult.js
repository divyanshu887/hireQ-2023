import React, { useState } from 'react';
// import './App.css';
import MaterialTable from 'material-table'
import GetAppIcon from '@material-ui/icons/GetApp';
import InfoIcon from '@material-ui/icons/Info';

function JdResult() {
  const [tableData, setTableData] = useState([
    { name: "Raj", email: "Raj@gmail.com", status: "A",  },
    { name: "Mohan", email: "mohan@gmail.com", status: "I",  },
    { name: "Sweety", email: "sweety@gmail.com", status: "A",   },
    { name: "Vikas", email: "vikas@gmail.com", status: "R",  },
    { name: "Neha", email: "neha@gmail.com", status: "I", },
    { name: "Mohan", email: "mohan@gmail.com", status: "A",   },
    { name: "Sweety", email: "sweety@gmail.com", status: "A",   },
    { name: "Vikas", email: "vikas@gmail.com", status: "R",  },
    { name: "Raj", email: "Raj@gmail.com", status: "R",  },
    { name: "Mohan", email: "mohan@gmail.com", status: "I",  },
    { name: "Sweety", email: "sweety@gmail.com",status: "I",   },
    { name: "Vikas", email: "vikas@gmail.com", status: "I",   },
  ])
  const columns = [
    { title: "Name", field: "name", sorting: false, filtering: false, headerStyle: { color: "#fff" } },
    { title: "Email", field: "email", filterPlaceholder: "filter" },
    { title: "Status", field: "status",
      lookup: { A: "Accepted", I: "In Process", R : "Rejected" } },
    // emptyValue: () => <em>null</em>,
    // render: (rowData) => <div style={{ background: rowData.status == 'A'? "#008000aa" : "#f90000aa",borderRadius:"4px",paddingLeft:5 }}>{rowData.age >= 18 ? "18+" : "18-"}</div>,
  ]
  return (
    <div >

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
          {
            icon: () => <InfoIcon />,
          tooltip: 'View Detail',
            onClick: (e, data) => console.log(data), 
          }
        ]}
        onSelectionChange={(selectedRows) => console.log(selectedRows)}
        options={{
          sorting: true, search: true,
          searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
          filtering: true, paging: true, pageSizeOptions: [2, 5, 10, 20, 25, 50, 100], pageSize: 5,
          paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
          exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: true,
          showSelectAllCheckbox: true, showTextRowsSelected: true, 
          grouping: true, columnsButton: true,
          rowStyle: (data, index) => index % 2 === 0 ? { background: "#f5f5f5" } : null,
          headerStyle: { background: "#f44336",color:"#fff"}
        }}
        title="Shortlisted Candidate Information"
         />
    </div>
  )
}

export default JdResult