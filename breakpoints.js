import domUtils from "domUtils";
import eventAggregator from "eventAggregator";

let breakpoints = function() {

	let bodyEl = domUtils.elements.body,
		size,
		newSize;

	function init() {
		window.addEventListener('resize', refreshValue);
		refreshValue();
	};

	function refreshValue() {
		newSize = window.getComputedStyle(bodyEl, ':before').getPropertyValue('content').replace(/("|')/g, "");
		if (newSize.length > 0) {
			if (newSize !== size) {
				size = newSize;
				eventAggregator.publish({
					'type': 'breakpointChange',
					'size': size
				});
			}
		} else {
			window.removeEventListener('resize', refreshValue);
		}
	};

	function getCurrentSize() {
		return size;
	};

	return {
		init: init,
		refreshValue: refreshValue,
		getCurrentSize: getCurrentSize
	}

};

var instance = breakpoints();

export default instance;