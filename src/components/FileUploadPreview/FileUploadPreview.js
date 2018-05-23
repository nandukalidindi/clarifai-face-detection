import React, { Component } from 'react';

import './FileUploadPreview.css';

class FileUploadPreview extends Component {

  constructor(props) {
    super(props);
    this.state = {};
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
      <div style={{width: "100%", height: "50px", display: "flex", alignItems: "center"}}>
        <img src={this.props.url} style={{height: "100%"}} />
        <span> {this.props.title} </span>
      </div>
    );
  }

};

FileUploadPreview.propTypes = {

};


export default FileUploadPreview;
