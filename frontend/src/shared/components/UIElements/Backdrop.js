import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

// is element outside the submenu, to hide submenu when clicked it
const Backdrop = (props) => {
	return ReactDOM.createPortal(
		<div className="backdrop" onClick={props.onClick}></div>,
		document.getElementById('backdrop-hook')
	);
};

export default Backdrop;
