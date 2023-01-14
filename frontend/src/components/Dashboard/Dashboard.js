import  React, {useState } from "react";
import { Container } from "react-bootstrap";
import "./Dashboard.css";
import { useHistory } from "react-router-dom";
import FileUpload from './FileUpload/FileUpload';
import FileList from './FileList/FileList';


export default function Dashboard() {
  const [files, setFiles] = useState([])

  const removeFile = (filename) => {
    setFiles(files.filter(file => file.name !== filename))
  }
  // const history = useHistory();
  return <Container className="mt-5 pt-5">

      <div className="title m-3">Upload JDs</div>
      <FileUpload files={files} setFiles={setFiles}
        removeFile={removeFile} />
      <FileList files={files} removeFile={removeFile} />

  </Container>;
}
