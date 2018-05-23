import React, { Component } from 'react';

import './FaceDetectionPreview.css';

class FaceDetectionPreview extends React.Component {

  constructor(props) {
    super(props);

    this.imageElem = React.createRef();

    this.state = {
      faceDetectors: []
    }
  }
  //===========================================================================
  //                          LIFE CYCLE HOOKS
  //===========================================================================


  //===========================================================================
  //                          EVENT HANDLERS
  //===========================================================================
  onImageLoad = (event) => {
    const imageHeight = this.imageElem.current.offsetHeight;
    const imageWidth = this.imageElem.current.offsetWidth;

    this.setState({
      faceDetectors: this.tranformRegionDimension(this.props.regions, { height: imageHeight, width: imageWidth })
    })
  }

  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  tranformRegionDimension = (regions, imageDimensions) => {
    return regions.map(region => {
      const left = (imageDimensions.width * region.region_info.bounding_box.left_col);
      const top = (imageDimensions.height * region.region_info.bounding_box.top_row);
      const width = ((imageDimensions.width * region.region_info.bounding_box.right_col) - left);
      const height = ((imageDimensions.height * region.region_info.bounding_box.bottom_row) - top);

      return {
        left: left + "px", top: top + "px", width: width + "px", height: height + "px"
      }
    });
  }

  render() {
    return (
      <div style={{height: this.props.height || "150px", position: "relative"}} onClick={this.props.onClick && this.props.onClick(this.props.url, this.props.regions)}>
        <img
          ref={this.imageElem}
          src={this.props.url} style={{height: "100%"}}
          onLoad={this.onImageLoad}
        />
        {
          this.state.faceDetectors.map(detector => (
            <div style={{...detector, backgroundColor: "black", position: "absolute"}} />
          ))
        }
      </div>
    );
  }

};

FaceDetectionPreview.propTypes = {

};


export default FaceDetectionPreview;
