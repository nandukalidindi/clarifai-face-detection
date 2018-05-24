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

  /**
   * Event handler to get the calculated height and width of the Image
   * that is shown on a custom container
   *
   * Calculates the positions of the bounding regions with respect to the
   * dimensions of the Image
   *
   * @param {object} event DOM Event
   */
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

  /**
   * Calculates the absolute positioning of the Face detector highlighters
   * based on the Image dimensions and the bounding regions from the API
   *
   * @param {object[]} regions region array obtained from the Predict API
   *  @param {object} region_info
   *    @param {object} bounding_box { left_col, top_row, right_col, bottom_row }
   *
   * @param {object} imageDimensions { height, width }
   *
   * @return {object[]} { left, top, width, height }
   */
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
      <div
        style={{...this.props.containerStyle, position: "relative", margin: "10px"}}
        className={this.props.containerClassName}
        onClick={this.props.onClick && this.props.onClick(this.props.url, this.props.regions)}
      >
        <img
          ref={this.imageElem}
          src={this.props.url}
          className="height-width-100"
          onLoad={this.onImageLoad}
        />
        {
          this.state.faceDetectors.map((detector, index) => (
            <div style={{...detector, position: "absolute"}} key={`detector-${index}`}>
              <svg className="upload-box-marquee height-width-100" xmlns="http://www.w3.org/2000/svg">
                <rect
                  style={this.props.highlighterStroke}
                  className="upload-box-rect height-width-100"
                  x="0" y="0"
                />
              </svg>
            </div>
          ))
        }
      </div>
    );
  }

};

FaceDetectionPreview.propTypes = {

};


export default FaceDetectionPreview;
