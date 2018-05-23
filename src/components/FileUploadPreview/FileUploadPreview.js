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
      <img src={this.props.url} style={{height: "100px", width: "160px", margin: "10px"}} />
    );
  }

};

FileUploadPreview.propTypes = {

};


export default FileUploadPreview;
