import domUtils from "domUtils";
import eventAggregator from "eventAggregator";

let breakpoints = function(options) {

	const NO_STYLES_MESSAGE = 'No stylesheet found for the selected element. See documentation.',
		  ALREADY_SET_MESSAGE = 'Breakpoints have already been set for the selected element.';

	let settings,
		element = domUtils.elements.body,
		size,
		newSize,
		isReady = false,
		defaults = {
			'elementSelector': null,
			'initedClass': 'breakpoint-is-inited',
			'onReady': null
		};

	function init() {
		settings = extend(this, defaults, options);
		if (settings.elementSelector !== null) {
			element = document.querySelector(settings.elementSelector);
		}
		bindEvents();
	};

	function bindEvents() {
		if (!element.classList.contains(settings.initedClass)) {
			window.addEventListener('resize', refreshValue);
			refreshValue();
		} else {
			console.log(ALREADY_SET_MESSAGE);
		}
		
	};

	function refreshValue() {
		newSize = window.getComputedStyle(element, ':before').getPropertyValue('content').replace(/("|')/g, "");
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
		element.classList.add(settings.initedClass);
		if ((settings.onReady !== null) && (!isReady)) {
			settings.onReady({
				'type': 'breakpointReady',
				'size': size,
				'element': element
			});
			isReady = true;
		}
	};

	function getCurrentSize() {
		return size;
	};

	function extend(out) {
		out = out || {};
	    for (var i = 1; i < arguments.length; i++) if (arguments[i]) for (var key in arguments[i]) arguments[i].hasOwnProperty(key) && (out[key] = arguments[i][key]);
	    	return out;
	};

	init();

	return {
		getCurrentSize: getCurrentSize
	};

};

export default breakpoints;