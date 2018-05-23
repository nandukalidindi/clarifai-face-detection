import React, { Component } from 'react';

import './ImageList.css';

import FaceDetectionPreview from "../FaceDetectionPreview";
import Modal from "../Modal";

class ImageList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      images: JSON.parse(localStorage.getItem("imagesList") || "[]"),
      modal: false,
      activePreview: {}
    }
  }

  //===========================================================================
  //                          LIFE CYCLE HOOKS
  //===========================================================================


  //===========================================================================
  //                          EVENT HANDLERS
  //===========================================================================


  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  closeModal = (event) => {
    this.setState({
      modal: false
    });
  }

  openPreview = (url, regions) => (event) => {
    this.setState({
      activePreview: { url, regions },
      modal: !this.state.modal
    })
  }

  render() {
    return (
      <div style={{display: "flex", flexWrap: "wrap"}}>
        {
          this.state.images.map(image => (
            <FaceDetectionPreview
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
                <div className="close-button" onClick={this.closeModal}>
                 CLOSE
                </div>
                <div style={{width: "90%", height: "90%"}}>
                  <FaceDetectionPreview
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
