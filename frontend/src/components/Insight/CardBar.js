import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Paper
} from "@material-ui/core";
import React from "react";


const useStyles = makeStyles(() => ({
  header: {
    textTransform: "uppercase",
    fontFamily:'Poppins',
    fontWeight:'800',
    fontSize:'4rem'
  }
}));

function CardBar({ title, chart }) {
  const classes = useStyles();
  return (
    <>
      <Card>
        <CardContent>
          <Typography className={classes.header} color="textPrimary">
            {title}
          </Typography>
          <Divider />
          {chart}
        </CardContent>
      </Card>
    </>
  );
}

export { CardBar };
