import React, { Component } from 'react';
import './Uploader.css';

import FileUploadPreview from "../FileUploadPreview";
import { FACE_DETECT_APP } from "../../utils/clarifai";

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

    Promise.all(files.map(this.getBase64)).then((response) => {
      const transformedResponse = response.map(file => ({
        title: file.title,
        url: file.url,
        type: "base64",
        uniqueId: `${file.title}-${(new Date()).getTime()}`
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
    const paramsHash = this.state.files.reduce((acc, image) => {
      acc[image.uniqueId] = {
        base64: image.url.split("base64,").pop(),
        id: image.uniqueId,
        type: image.type
      };

      return acc;
    }, {});

    const buildPredictParameters = Object.keys(paramsHash).map(uniqueId => ({
      [paramsHash[uniqueId]["type"]]: paramsHash[uniqueId]["base64"],
      id: uniqueId
    }));

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

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve({title: file.name, url: reader.result});
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
        reject(error);
      };
    })
  }

  render() {
    return (
      <div style={{width: "100%", height: "100%"}} className="container">
        <div
          className="dnd-uploader"
          onDrop={this.onFilesDrop}
          onDragOver={this.onDragOver}
        >
          <svg className="upload-box-marquee" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <rect className="upload-box-rect" x="0" y="0" width="100%" height="100%"></rect>
          </svg>
          <div>
            <img src="" />
            <label htmlFor="file-upload">
              <input
                id="file-upload"
                ref={(elem) => { this.fileUploadEl = elem; }}
                style={{display: "none"}}
                type="file"
                multiple="true"
                onChange={this.onFilesUpload}
              />
              browse
            </label>
          </div>
        </div>
        <div className="preview-list">
          {
            this.state.files.map(file => <FileUploadPreview title={file.title} url={file.url} />)
          }
        </div>
        <div className="toolbar">
          <div style={{display: "flex", justifyContent: "space-between"}}>
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
