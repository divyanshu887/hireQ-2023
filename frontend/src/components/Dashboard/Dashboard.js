import React, { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import './Dashboard.css';
import { useHistory } from 'react-router-dom';
import FileUpload from './FileUpload/FileUpload';
import FileList from './FileList/FileList';

export default function Dashboard() {
  const [files, setFiles] = useState([]);

  const removeFile = filename => {
    setFiles(files.filter(file => file.name !== filename));
  };

  const history = useHistory();
  const handleClick = () => {
    history.push("/JdHistory")
  }

  return (
    <Container className="mt-5 pt-5 d-flex flex-column align-items-center">
      <div className="title m-3">Upload JDs</div>
      <FileUpload files={files} setFiles={setFiles} removeFile={removeFile} />
      <FileList files={files} removeFile={removeFile} />
      {files.length > 0 && <Button className="btn-lg" onClick={handleClick}>Proceed To Scan</Button>}
    </Container>
  );
}
