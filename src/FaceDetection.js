import React, { Component } from "react";

import Uploader from "./components/Uploader";
import ImageList from "./components/ImageList";
import Modal from "./components/Modal";

class FaceDetection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false
    }
  }

  uploaderModal = (event) => {
    this.setState({
      modal: !this.state.modal
    });
  }

  render() {
    return (
      <div style={{margin: "50px", textAlign: "center", position: "relative"}}>
        <ImageList />
        <div
          className="process-button add-images-links-button"
          onClick={this.uploaderModal}
        >
          ▲
        </div>
        {
          this.state.modal
            ?
            <div className="modal-dialog">
              <div style={{overflowY: "auto"}}>
                <div className="process-button close-button" onClick={this.uploaderModal}>
                 CLOSE
                </div>
                <div style={{width: "100%", height: "90%"}}>
                  <Uploader closeModal={this.uploaderModal}/>
                </div>
              </div>
            </div>
            :
            <div className="modal-dialog-before" />
          }
      </div>
    );
  }
}

export default FaceDetection;
