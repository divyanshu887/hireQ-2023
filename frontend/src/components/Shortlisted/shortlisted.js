import React from 'react';
import {
  makeStyles,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from '@material-ui/core';

import Candidates from './candidate/candidate';

const theme = createTheme({
    typography: {
        fontSize: 26,
      },
  palette: {
    primary: {
      main: '#333996',
      light: '#3c44b126',
    },
    secondary: {
      main: '#f83245',
      light: '#f8324526',
    },
    background: {
      default: '#f4f5fd',
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: 'translateZ(0)',
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
  appMain: {
    width: '100%',
  },
});

function ShortlistedProfile() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.appMain} >
        <Candidates />
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default ShortlistedProfile;
