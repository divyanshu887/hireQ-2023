import React,{useState,useEffect} from "react";
import axios from 'axios'
import { Grid } from "@material-ui/core";
import { BarChart } from "./BarChart";
import { CardBar } from "./CardBar";





export default function Insights() {
  return (
    <div >
    <Grid className="mt-2 mx-2 text-center">
      <Grid container spacing={2}>
               <Grid item xl={8} lg={8} md={12} sm={12} xs={12} className="mx-auto" style={{fontSize:'40px',height:"70vh"}}>
        <CardBar title="Trend of Popular Tech Stacks" chart={<BarChart />} />
        </Grid>
      </Grid>
    </Grid>
    </div>
  );
}


