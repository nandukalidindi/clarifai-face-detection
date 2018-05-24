import React, { Component } from 'react';

import './ImageList.css';

import FaceDetectionPreview from "../FaceDetectionPreview";
import Modal from "../Modal";
import FlashMessage from "../FlashMessage";

import EMITTER from "../../utils/emitter";


/**
 * Stateless Component to render the Blank landing page i.e when no images are
 * sent for processing
 *
 * @return {JSX}
 */
const BlankLandingPage = () => (
  <div className="flex-center blank-landing-page">
    <div style={{margin: "10px"}}> SEEMS LIKE ITS LONELY OUT HERE </div>
    <div style={{margin: "10px"}}> CLICK ON THE ORANGE ICON TO UPLOAD IMAGES </div>
  </div>
)

class ImageList extends React.Component {

  constructor(props) {
    super(props);

    this.predictSubscription = null;
    this.state = {
      images: JSON.parse(localStorage.getItem("imagesList") || "[]"),
      modal: false,
      activePreview: {},
      showSuccessMessage: false
    }
  }

  //===========================================================================
  //                          LIFE CYCLE HOOKS
  //===========================================================================
  componentWillMount() {
    this.predictSubscription = EMITTER.addListener("refreshImageList", () => {
      this.setState({
        images: JSON.parse(localStorage.getItem("imagesList") || "[]")
      });
    })
  }

  componentWillUnmount() {
    this.predictSubscription && this.predictSubscription.remove();
  }

  //===========================================================================
  //                          EVENT HANDLERS
  //===========================================================================

  /**
   * Event Handler to close the popup modal that is opened to show the Preview
   *
   * @param {object} event
   */
  closeModal = (event) => {
    this.setState({
      modal: false
    });
  }

  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  /**
   * Event Handler to open the popup modal that is opened to show the Preview
   *
   * @param {string} url
   * @param {object[]} regions
   */
  openPreview = (url, regions) => (event) => {
    this.setState({
      activePreview: { url, regions },
      modal: !this.state.modal
    })
  }

  render() {
    return (
      <div style={{display: "flex", flexWrap: "wrap", width: "80%"}}>
        { this.state.images.length === 0 && <BlankLandingPage /> }
        {
          this.state.images.map((image, index) => (
            <FaceDetectionPreview
              key={`image-${index}`}
              containerStyle={{width: "200px", height: "150px"}}
              highlighterStroke={{strokeWidth: "2px", strokeDasharray: "4 6", stroke: "black"}}
              containerClassName={"image-scalable-thumbnail"}
              url={image.url}
              regions={image.regions || []}
              onClick={this.openPreview}
            />
          ))
        }
        {
          this.state.modal
            ?
            <div className="modal-dialog">
              <div style={{overflowY: "auto"}}>
                <div className="process-button close-button" onClick={this.closeModal}>
                 CLOSE
                </div>
                <div style={{width: "90%", height: "95%"}}>
                  <FaceDetectionPreview
                    containerStyle={{width: "100%", height: "100%"}}
                    highlighterStroke={{strokeWidth: "4px", strokeDasharray: "6 10", stroke: "black"}}
                    url={this.state.activePreview.url}
                    regions={this.state.activePreview.regions}
                    height={"90%"}
                  />
                </div>
              </div>
            </div>
            :
            <div className="modal-dialog-before" />
          }
      </div>
    );
  }

};

ImageList.propTypes = {

};


export default ImageList;
