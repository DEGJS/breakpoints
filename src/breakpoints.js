import eventAggregator from "DEGJS/eventAggregator";

let breakpoints = function(options) {

	const NO_PSEUDO_CONTENT_MESSAGE = 'No pseudo-element content found. See documentation.',
		  ALREADY_SET_MESSAGE = 'Breakpoints has already been set for the selected element.';

	let settings,
		element,
		size = null,
		defaults = {
			'pseudoElementSelector': ":before",
			'element': null,
			'elementSelector': null,
			'initedAttributeName': 'data-breakpoints-inited'
		};

	function init() {
		settings = Object.assign({}, defaults, options);
		if(settings.element !== null) {
			element = settings.element;
		} else if (settings.elementSelector !== null) {
			element = document.querySelector(settings.elementSelector);
		} else {
			element = document.body;
		}
		
		if (element.getAttribute(settings.initedAttributeName) != 'true') {
			element.setAttribute(settings.initedAttributeName, 'true');
			bindEvents();
		} else {
			console.log(ALREADY_SET_MESSAGE);
		}
	};

	function bindEvents() {
		window.addEventListener('resize', refreshValue);
		refreshValue();
	};

	function refreshValue() {
		let newSize = null;
		if(window.getComputedStyle) {
			let contentValue = window.getComputedStyle(element, settings.pseudoElementSelector).getPropertyValue('content');
			if(typeof contentValue !== 'undefined' && contentValue !== null) {
				newSize = contentValue.replace(/("|')/g, "");	
			}		
		}
		if (newSize === null || typeof newSize === 'undefined' || newSize.length === 0) {
			console.log(NO_PSEUDO_CONTENT_MESSAGE);
			window.removeEventListener('resize', refreshValue);
		} else {
			if (newSize !== size) {
				size = newSize;
				eventAggregator.publish({
					'type': 'breakpointChange',
					'size': size,
					'element': element
				});
			}
		}
	};

	function getCurrentSize() {
		return size;
	};

	init();

	return {
		getCurrentSize: getCurrentSize
	};

};

export default breakpoints;