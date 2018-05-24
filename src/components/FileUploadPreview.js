// TITLE: FileUploadPreview
// DESCRIPTION: Preview component to be shown after Drag N Drop OR Manual Upload
//              OR Inserting URL.

import React, { Component } from 'react';

const FileUploadPreview = ({ url }) => (
  <img
    src={url}
    style={{height: "100px", width: "160px", margin: "10px"}}
  />
)

export default FileUploadPreview;
