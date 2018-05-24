import React, { Component } from 'react';
import './Uploader.css';

import UploadIcon from "../../images/upload-to-cloud.png";

import FileUploadPreview from "../FileUploadPreview";
import { FACE_DETECT_APP } from "../../utils/clarifai";
import BASE64_EXTRACTOR from "../../utils/base64Extractor"

const DnDUploader = ({ onDrop, onDragOver, onChange }) => (
  <div
    className="dnd-uploader"
    onDrop={onDrop}
    onDragOver={onDragOver}
  >
    <svg className="upload-box-marquee" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect
        className="upload-box-rect height-width-100"
        x="0" y="0"
      />
    </svg>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
      <img src={UploadIcon} style={{width: "150px"}} />
      <div> Drag and Drop </div>
      <div> OR </div>
      <label htmlFor="file-upload" style={{cursor: "pointer"}}>
        <input
          id="file-upload"
          style={{display: "none"}}
          type="file"
          multiple="true"
          onChange={onChange}
        />
        <em>Choose</em> from file system
      </label>
    </div>
  </div>
)

class Uploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      processing: false
    };
  }

  //===========================================================================
  //                          LIFE CYCLE HOOKS
  //===========================================================================


  //===========================================================================
  //                          EVENT HANDLERS
  //===========================================================================

  onFilesUpload = (event) => {
    const files = Object.keys(event.target.files).map(file => event.target.files[file]);

    Promise.all(files.map(BASE64_EXTRACTOR)).then((response) => {
      const transformedResponse = response.map(file => ({
        url: file,
        type: "base64",
      }));

      this.setState({
        files: [...this.state.files, ...transformedResponse]
      });
    })
  }

  onFilesDrop = (event) => {
    event.preventDefault();
    this.onFilesUpload({ target: { files: event.dataTransfer.files } });
  }

  onDragOver = (event) => {
    event.preventDefault();
  }

  addUrl = (event) => {
    this.insertableURL = event.target.value;
  }

  insertURL = (event) => {
    const files = [...this.state.files];

    files.push({
      title: "",
      url: this.insertableURL,
      type: "url"
    });

    this.setState({ files });
  }

  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  processImagesForFaceDetection = (event) => {
    const buildPredictParameters = this.state.files.map(file => ({
      [file.type]: file.type === "base64" ? file.url.split("base64,").pop() : file.url
    }))

    FACE_DETECT_APP.models.predict(Clarifai.FACE_DETECT_MODEL, buildPredictParameters, {video: false})
       .then(response => {
         const outputs = (response.rawData || {}).outputs || [];

         const existingImages = JSON.parse(localStorage.getItem("imagesList") || "[]");

         const storableData = [...existingImages, ...outputs.map(output => ({
           id: output.input.id,
           url: output.input.data.image.url,
           regions: output.data.regions
         }))]

         localStorage.setItem("imagesList", JSON.stringify(storableData));
       })
       .catch(error => {
         debugger;
       })
  }

  render() {
    return (
      <div className="container height-width-100">
        <DnDUploader
          onDrop={this.onFilesDrop}
          onDragOver={this.onDragOver}
          onChange={this.onFilesUpload}
        />

        <div className="preview-list">
          {
            this.state.files.map((file, index) => (
              <FileUploadPreview
                key={`file-${index}`}
                title={file.title}
                url={file.url}
              />
            ))
          }
        </div>
        <div className="toolbar">
          <div className="flex-center">
            <input
              className="url-input-box"
              type="text"
              defaultValue=""
              onChange={this.addUrl}
              placeholder="Enter a URL"
            />
            <div className="process-button" onClick={this.insertURL}> URL </div>
          </div>
          <div
            style={this.state.files.length > 0 ? { pointerEvents: "auto", opacity: 1.0, width: "100%", height: "30px" } : { pointerEvents: "none", opacity: 0.5, width: "100%", height: "30px" }}
            className="process-button"
            onClick={this.processImagesForFaceDetection}
          >
            PROCESS
          </div>
        </div>
      </div>
    );
  }

};

Uploader.propTypes = {

};


export default Uploader;
