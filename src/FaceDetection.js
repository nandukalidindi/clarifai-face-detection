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
      <div style={{padding: "50px"}}>
        <ImageList />
        <input value="UPLOAD" type="button" onClick={this.uploaderModal} />
        {
          this.state.modal
            ?
            <div className="modal-dialog">
              <div style={{overflowY: "auto"}}>
                <div className="close-button" onClick={this.uploaderModal}>
                 CLOSE
                </div>
                <div style={{width: "100%", height: "90%"}}>
                  <Uploader />
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
