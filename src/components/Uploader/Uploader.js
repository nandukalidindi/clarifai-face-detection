// TITLE: Uploader
// DESCRIPTION: Component rendered on top of the Modal and is responsible
//              for aiding users in uploading images via
//              Drag N Drop OR Manual Upload OR Inserting URL

import React, { Component } from 'react';
import PropTypes from "prop-types";
import './Uploader.css';

import UploadIcon from "../../images/upload-to-cloud.png";

import FileUploadPreview from "../FileUploadPreview";
import Modal from "../Modal";
import FlashMessage from "../FlashMessage";

import { FACE_DETECT_APP } from "../../utils/clarifai";
import BASE64_EXTRACTOR from "../../utils/base64Extractor"
import EMITTER from "../../utils/emitter";
import URLValidator from "../../utils/url-validator";


/**
 * Stateless component that only is responsible for rendering the Drag and Drop
 * placeholder on the left side of the screen
 *
 * @param {object} { onDrop:func, onDragOver:func, onChange:func }
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
 * @param {object} { files:array }
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

/**
 * Stateless component that only is responsible for rendering the Toolbar controls
 * which help in invoking the necessary operations for the Uploaded images.
 *
 * @param {object} {
 *                   validURL:boolean, validateURL:func, insertURL:func, files:array,
 *                   processing:boolean, processImagesForFaceDetection:func
 *                 }
 * @return {JSX}
 */
const UploaderToolbar = ({
  validURL, validateURL, insertURL,
  files, processing, processImagesForFaceDetection
}) => (
  <div className="toolbar">
    <div className="flex-center">
      <input
        className={["url-input-box", validURL ? "" : "url-input-box-errors"].join(" ")}
        type="text"
        defaultValue=""
        onChange={validateURL}
        placeholder="Enter a URL"
      />
      <div
        className={["process-button", validURL ? "" : "url-input-button-errors"].join(" ")}
        style={{height: "30px"}}
        onClick={insertURL}
      >
        INSERT URL
      </div>
    </div>
    <div
      style={
        files.length > 0 || processing ?
          { pointerEvents: "auto", opacity: 1.0, width: "100%", height: "30px" }
          :
          { pointerEvents: "none", opacity: 0.5, width: "100%", height: "30px" }
      }
      className="process-button"
      onClick={processImagesForFaceDetection}
    >
      { processing ? "PROCESSING ..." : "PROCESS" }
    </div>
  </div>
)

class Uploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [],
      processing: false,
      validURL: false,
      status: false,
      message: "",
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
  validateURL = (event) => {
    this.insertableURL = event.target.value;
    this.setState({ validURL: URLValidator(this.insertableURL) })
  }

  /**
   * Handler to insert a new file into the files state variable upon the click
   * of the corresponding button
   *
   * NOTE: SINCE I AM RUNNING THE APPLICATION IN A LOCAL SERVER I DID NOT ADD
   *       ANY FURTHER VALIDATION IF THE URL IS INFACT AN IMAGE.
   *
   *       I HAD THE IDEA OF SENDING A FAKE XMLHTTPREQUEST TO CHECK IF THE
   *       RESPONSE HEADERS CONTAINED content-type: image/*
   *
   * @see validateURL
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
           { processing: false, files: [], status: "success", message: "FACES DETECTED!!" },
           () => {
             EMITTER.emit("refreshImageList");
             setTimeout(() => {
               this.props.closeModal()
             }, 1500);
           }
         );
       })
       .catch(error => {
         this.setState(
           { status: "error", message: "INVALID INPUT!!" },
           () => {
             EMITTER.emit("refreshImageList");
             setTimeout(() => {
               this.props.closeModal()
             }, 1500);
           }
         )
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

        <UploaderToolbar
          validURL={this.state.validURL}
          validateURL={this.validateURL}
          insertURL={this.insertURL}
          processing={this.state.processing}
          files={this.state.files}
          processImagesForFaceDetection={this.processImagesForFaceDetection}
        />

        {
          this.state.status &&
            <Modal>
              <FlashMessage type={this.state.status} message={this.state.message} />
            </Modal>
        }
      </div>
    );
  }

};

Uploader.propTypes = {
  closeModal: PropTypes.func
};


export default Uploader;
