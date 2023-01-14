import React,{useState,useEffect} from "react";
import axios from 'axios'
import { Grid } from "@material-ui/core";
import { BarChart } from "./BarChart";
import { CardBar } from "./CardBar";
// import { CardSummary } from "../Utils/cardSummary";

var usersLength;
var totalDelivered;
var totalSent;


// async function getData(){
//   const response = await axios.get('http://localhost:5000/getusers')
//       usersLength = Object.keys(response.data).length;
//   const response2 = await axios.get('http://localhost:5000/Analytics')
//     var totalData = response2.data;
//     totalDelivered = totalData.AnalyticsData.totalDelivered;
//     totalSent = totalData.AnalyticsData.totalSent;
//     }
// getData();


export default function Insights() {
  return (
    <div style={{backgroundColor:'#cbe0ff', height: '93.5vh'}}>
    <Grid className="mt-2 mx-2 text-center">
      <Grid container spacing={2}>
               <Grid item xl={8} lg={8} md={12} sm={12} xs={12} className="mx-auto" style={{fontSize:'40px',height:"70vh"}}>
        <CardBar title="Activity Report" chart={<BarChart />} />
        </Grid>
      </Grid>
    </Grid>
    </div>
  );
}

// export { Analytics };

