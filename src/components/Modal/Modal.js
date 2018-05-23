import React from 'react';

import './Modal.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.modalEl = document.createElement('div');
  }

  state = {

  }

  //===========================================================================
  //                          LIFE CYCLE HOOKS
  //===========================================================================
  componentDidMount() {
    modalRoot.appendChild(this.modalEl);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.modalEl)
  }

  //===========================================================================
  //                          EVENT HANDLERS
  //===========================================================================


  //===========================================================================
  //                          INSTANCE METHODS
  //===========================================================================

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.modalEl
    );
  }
};

Modal.propTypes = {

};


export default Modal;
