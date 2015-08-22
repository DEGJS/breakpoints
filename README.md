# Breakpoints

Trigger CSS-based breakpoint events with JavaScript.

## Sample Usage

``` javascript
eventAggregator.subscribe('breakpointChange', function(e) {
	console.log(e);
});
```