import axios from "axios";
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import FileItem from "./../FileItem/FileItem";

const FileList = ({ files, removeFile }) => {
  const { logout } = useAuth();
  const deleteFileHandler = (_name) => {
    axios
      .delete(`http://localhost:5000/api/upload/${_name}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then(async (res) => {
        if (res.status === 401) {
          await logout();
        } else {
          return removeFile(_name);
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <ul className="file-list">
      {files &&
        files.map((f) => (
          <FileItem key={f.name} file={f} deleteFile={deleteFileHandler} />
        ))}
    </ul>
  );
};
export default FileList;
