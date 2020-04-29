import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = (props) => {
	// <a></a> html button
	if (props.href) {
		return (
			<a
				className={`button button--${props.size || 'default'} ${
					props.inverse && 'button--inverse'
				} ${props.danger && 'button--danger'}`}
				href={props.href}
			>
				{props.children}
			</a>
		);
	}

	// Link of react router dom button
	if (props.to) {
		return (
			<Link
				to={props.to}
				exact={props.exact}
				className={`button button--${props.size || 'default'} ${
					props.inverse && 'button--inverse'
				} ${props.danger && 'button--danger'}`}
			>
				{props.children}
			</Link>
		);
	}
	// normal button
	return (
		<button
			className={`button button--${props.size || 'default'} ${
				props.inverse && 'button--inverse'
			} ${props.danger && 'button--danger'}`}
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{props.children}
		</button>
	);
};

export default Button;
