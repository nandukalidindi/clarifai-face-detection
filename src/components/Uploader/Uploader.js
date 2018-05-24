import React, { Component } from 'react';
import PropTypes from "prop-types";
import './Uploader.css';

import UploadIcon from "../../images/upload-to-cloud.png";

import FileUploadPreview from "../FileUploadPreview";
import { FACE_DETECT_APP } from "../../utils/clarifai";
import BASE64_EXTRACTOR from "../../utils/base64Extractor"
import EMITTER from "../../utils/emitter";

/**
 * Stateless component that only is responsible for rendering the Drag and Drop
 * placeholder on the left side of the screen
 *
 * @param {object} { onDrop, onDragOver, onChange }
 * @return {JSX}
 */
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
          accept="image/x-png,image/jpeg"
          onChange={onChange}
        />
        <em>Choose</em> from file system
      </label>
    </div>
  </div>
)

/**
 * Stateless component to render the list of all uploaded items either by
 * Drag N Drop OR Manual Upload OR Inserting URL
 *
 * @param {object} { files }
 * @return {JSX}
 */
const PreviewList = ({ files }) => (
  <div className="preview-list">
    {
      files.map((file, index) => (
        <FileUploadPreview
          key={`file-${index}`}
          title={file.title}
          url={file.url}
        />
      ))
    }
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

  /**
   * Event handler to construct the files state variable based on the uploaded
   * images from local file system
   *
   * @param {object} event DOM Event
   */
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

  /**
   * Event handler that gets all the files uploaded VIA Drag N Drop
   *
   * @see onFilesUpload
   * @param {object} event DOM Event
   */
  onFilesDrop = (event) => {
    event.preventDefault();
    this.onFilesUpload({ target: { files: event.dataTransfer.files } });
  }

  /**
   * Event handler to prevent the conventional behaviour of onDragOver which will
   * basically render the file dropped onto the browser
   *
   * @param {object} event DOM Event
   */
  onDragOver = (event) => {
    event.preventDefault();
  }

  /**
   * Text input event handler to keep track of the URL that need to be inserted
   * upon the click of the button that handles insertURL
   *
   * @see insertURL
   * @param {object} event DOM Event
   */
  addUrl = (event) => {
    this.insertableURL = event.target.value;
  }

  /**
   * Handler to insert a new file into the files state variable upon the click
   * of the corresponding button
   *
   * @see addUrl
   * @param {object} event DOM Event
   */
  insertURL = (event) => {
    const files = [...this.state.files];

    files.push({
      title: "",
      url: this.insertableURL,
      type: "url"
    });

    this.setState({ files });
  }

  /**
   * Handler to send a request to CLARIFAI with the constructed parameters based
   * on the files that are uploaded either through Drag N Drop OR Manual Upload
   * OR Inserting URL
   *
   * @param {object} event DOM Event
   */
  processImagesForFaceDetection = (event) => {
    this.setState({ processing: true });
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

         this.setState(
           { processing: false, files: [] },
           () => {
             this.props.closeModal();
             EMITTER.emit("refreshImageList");
           }
         );
       })
       .catch(error => {
         debugger;
       })
  }

  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  render() {
    return (
      <div className="container height-width-100">
        <DnDUploader
          onDrop={this.onFilesDrop}
          onDragOver={this.onDragOver}
          onChange={this.onFilesUpload}
        />

        <PreviewList files={this.state.files} />

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
            style={
              this.state.files.length > 0 || this.state.processing ?
                { pointerEvents: "auto", opacity: 1.0, width: "100%", height: "30px" }
                :
                { pointerEvents: "none", opacity: 0.5, width: "100%", height: "30px" }
            }
            className="process-button"
            onClick={this.processImagesForFaceDetection}
          >
            { this.state.processing ? "PROCESSING ..." : "PROCESS" }
          </div>
        </div>
      </div>
    );
  }

};

Uploader.propTypes = {
  closeModal: PropTypes.func
};


export default Uploader;
