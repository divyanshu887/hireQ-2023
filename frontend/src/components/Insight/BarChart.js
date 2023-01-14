import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import {
   Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { Stack, Animation } from '@devexpress/dx-react-chart';


const Root = props => (
  <Legend.Root {...props} sx={{ display: 'flex', margin: 'auto', flexDirection: 'row' }} />
);
const Label = props => (
  <Legend.Label {...props} sx={{ whiteSpace: 'nowrap' }} />
);

// var database = [];
// async function getData(){
//   const response = await axios.get('http://localhost:5000/Analytics')
//       // console.log(response.data);
//       var objectLength = Object.keys(response.data).length;
//       // console.log(objectLength);
//       for (const key in response.data) {
//           if(objectLength==1)
//           break;
//           database.push(response.data[key]);
//            objectLength--;
//           }
//           console.log(objectLength)
//           console.log(database);
//     }
// console.log(database);
// getData();

//   var database = [];
  const database = [
    {
      Date: '10-12-2022', Sends: 90, Received: 79, 
    }, {
      Date: '11-12-2022', Sends: 75, Received: 75, 
    }, {
      Date: '12-12-2022', Sends: 80, Received: 71, 
    },{
      Date: '13-12-2022', Sends: 70, Received: 50, 
    }, {
      Date: '14-12-2022', Sends: 60, Received: 60, 
    }, {
      Date: '15-12-2022', Sends: 21, Received: 19, 
     }];

function BarChart() {
  return (
    <Paper>
        <Chart
          data={database}
          rotated="true"
        >  
          <ArgumentAxis />
          <ValueAxis
            max={2400}
          />
          <BarSeries
            name="Total Notfication Sent by Admin"
            valueField="Sends"
            argumentField="Date"
            color="#205295"
          />
          <Animation />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          {/* <Title text="Last Seven Days" /> */}
          <Stack
          />
        </Chart>
      </Paper>
  );
}

export { BarChart };
