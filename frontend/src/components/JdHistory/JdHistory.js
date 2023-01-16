import React from "react";
import {
  makeStyles,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";

import JobDescription from "./jobDescription";
import { useAuth } from "../../contexts/AuthContext";

const theme = createTheme({
  typography: {
    fontSize: 26,
  },
  palette: {
    primary: {
      main: "#333996",
      light: "#3c44b126",
    },
    secondary: {
      main: "#f83245",
      light: "#f8324526",
    },
    background: {
      default: "#f4f5fd",
    },
  },
  overrides: {
    MuiAppBar: {
      root: {
        transform: "translateZ(0)",
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
    width: "100%",
  },
});

function JdHistory() {
  const classes = useStyles();
  const { currentUser, logout } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.appMain}>
        <JobDescription currentUser={currentUser} logout={logout} />
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default JdHistory;
