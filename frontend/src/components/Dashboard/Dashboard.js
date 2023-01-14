import React from "react";
import { Container } from "react-bootstrap";
import "./Dashboard.css";
import { useHistory } from "react-router-dom";

export default function Dashboard() {
  const history = useHistory();
  return <Container className="mt-5 pt-5">Dashboard</Container>;
}
