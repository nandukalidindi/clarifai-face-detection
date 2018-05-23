import React, { Component } from 'react';
import './Uploader.css';

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


  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  render() {
    return (
      <div style={{width: "100%", height: "100%", display: "flex"}}>
        <div style={{width: "50%", height: "100%", backgroundColor: "gray"}} onDrop={this.onFilesDrop} onDragOver={this.onDragOver}>
        </div>
        <div style={{width: "50%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
          {
            // this.state.files.map(file => <FileUploadPreview title={file.title} url={file.url} />)
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
