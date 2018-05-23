import React, { Component } from 'react';
import './Uploader.css';

import FileUploadPreview from "../FileUploadPreview";
import { FACE_DETECT_APP } from "../../utils/clarifai";

class Uploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: []
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
        base64: file.url,
        url: file.url,
        uniqueId: `${file.title}-${(new Date()).getTime()}`
      }));

      this.setState({
        files: transformedResponse
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

  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  processImagesForFaceDetection = (event) => {
    const paramsHash = this.state.files.reduce((acc, image) => {
      acc[image.uniqueId] = {
        base64: image.url.split("base64,").pop(),
        fullBase64: image.url,
        id: image.uniqueId
      };

      return acc;
    }, {});

    const buildPredictParameters = Object.keys(paramsHash).map(uniqueId => ({
      base64: paramsHash[uniqueId]["base64"],
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
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve({title: file.name, url: reader.result});
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        reject(error)
      };
    })
  }

  render() {
    return (
      <div style={{width: "100%", height: "100%", display: "flex"}}>
        <div style={{width: "50%", height: "100%", backgroundColor: "gray"}} onDrop={this.onFilesDrop} onDragOver={this.onDragOver}>
        </div>
        <div style={{width: "50%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
          {
            this.state.files.map(file => <FileUploadPreview title={file.title} url={file.url} />)
          }
          <div>
            <input type="file" multiple="true" onChange={this.onFilesUpload} />
            <input type="text" /> <input type="button" defaultValue="INSERT URL" />
            <input type="button" defaultValue="PROCESS" onClick={this.processImagesForFaceDetection} />
          </div>
        </div>
      </div>
    );
  }

};

Uploader.propTypes = {

};


export default Uploader;
