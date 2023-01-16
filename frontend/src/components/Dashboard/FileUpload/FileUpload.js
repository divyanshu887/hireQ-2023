import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./FileUpload.css";
import axios from "axios";

const FileUpload = ({ files, setFiles, removeFile }) => {
  const uploadHandler = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    file.isUploading = true;
    file.fileid = Date.now() + "-" + file.name;
    setFiles([...files, file]);

    // upload file
    const formData = new FormData();
    formData.append("newFile", file, file.fileid);
    axios
      .post("http://localhost:5000/api/upload", formData, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        file.isUploading = false;
        console.log(res, "hello");

        setFiles([...files, file]);
      })
      .catch((err) => {
        // inform the user
        console.error(err);
        removeFile(file.fileid);
      });
  };

  return (
    <>
      <div className="file-card">
        <div className="file-inputs">
          <input type="file" onChange={uploadHandler} />
          <button>
            <i>
              <FontAwesomeIcon icon={faPlus} />
            </i>
            Upload
          </button>
        </div>

        <h4 className="main">Supported files</h4>
        <p className="info">PDF</p>
      </div>
    </>
  );
};

export default FileUpload;
