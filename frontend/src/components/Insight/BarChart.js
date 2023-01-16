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
  <Legend.Root
    {...props}
    sx={{
      display: 'flex',
      margin: 'auto',
      flexDirection: 'row',
      fontSize: '1.4rem',
    }}
  />
);
const Label = props => (
  <Legend.Label {...props} sx={{ whiteSpace: 'nowrap' }} />
);

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
    <Paper>
      <Chart data={database} rotated="true">
        <ArgumentAxis />
        <ValueAxis max={2400} />

        <BarSeries
          name="popular Skills "
          valueField="Count"
          argumentField="Skill"
          color="#205295"
        />
        <Animation />
        <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
        <Stack />
      </Chart>
    </Paper>
  );
}

export { BarChart };
