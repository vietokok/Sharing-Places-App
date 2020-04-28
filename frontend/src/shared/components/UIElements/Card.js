import React from 'react';

import './Card.css';

// define a element to share
const Card = (props) => {
	return (
		<div className={`card ${props.className}`} style={props.style}>
			{props.children}
		</div>
	);
};

export default Card;
