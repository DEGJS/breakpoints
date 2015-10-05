import eventAggregator from "eventAggregator";

let breakpoints = function(options) {

	const NO_STYLES_MESSAGE = 'No stylesheet found for the selected element. See documentation.',
		  ALREADY_SET_MESSAGE = 'Breakpoints have already been set for the selected element.';

	let settings,
		element,
		size,
		defaults = {
			'pseudoElementSelector': ":before",
			'elementSelector': null,
			'initedAttributeName': 'data-breakpoints-inited'
		};

	function init() {
		settings = Object.assign({}, defaults, options);
		if (settings.elementSelector !== null) {
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
		let newSize = window.getComputedStyle(element, settings.pseudoElementSelector).getPropertyValue('content').replace(/("|')/g, "");
		if ((newSize.length === 0) || (newSize === 'undefined')) {
			console.log(NO_STYLES_MESSAGE);
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