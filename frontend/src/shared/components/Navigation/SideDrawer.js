import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

// container sub menubar, using transition of third party
const SideDrawer = (props) => {
	const content = (
		// in: onClick, timeout: time of effect, classNames: define in CSS
		// mountOnEnter: mean 'slide-in-left-enter', unmountOnExit: mean 'slide-in-left-exit'
		<CSSTransition
			in={props.show}
			timeout={200}
			classNames="slide-in-left"
			mountOnEnter
			unmountOnExit
		>
			{/* aside is html tag, using to define a element out of main but content related to each other  */}
			<aside className="side-drawer" onClick={props.onClick}>
				{props.children}
			</aside>
		</CSSTransition>
	);
	// createPorTal to create a element outside of 'root', is children of args[1]
	return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;
