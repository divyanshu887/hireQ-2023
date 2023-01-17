import * as React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
} from '@devexpress/dx-react-chart-material-ui';
import { Stack, Animation } from '@devexpress/dx-react-chart';

const database = [
  {
    Skill: 'Python',
    Count: 90,
  },
  {
    Skill: 'React',
    Count: 75,
  },
  {
    Skill: 'Javascript',
    Count: 71,
  },
  {
    Skill: 'NodeJS',
    Count: 50,
  },
  {
    Skill: 'Go',
    Count: 60,
  },
  {
    Skill: 'Selenium',
    Count: 19,
  },
];

function BarChart() {
  return (
    <Paper style={{fontSize:"40px"}}>
      <Chart data={database} rotated="true">
        <ArgumentAxis />
        <ValueAxis   />
        <BarSeries
        color="#205295"
          valueField="Count"
          argumentField="Skill"
        />
        <Animation />
        <Stack />
      </Chart>
    </Paper>
  );
}

export { BarChart };
