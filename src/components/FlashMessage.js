import React, { Component } from "react";

const FlashMessage = ({ type, message }) => (
  <div className={type}>
    <div className="inner-div">
      {message}
    </div>
  </div>
)

export default FlashMessage;
