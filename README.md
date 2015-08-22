# Breakpoints
Trigger CSS-based breakpoint events with JavaScript.

## Sample Usage
``` javascript
eventAggregator.subscribe('breakpointChange', function(e) {
	console.log(e);
});
```

## Available Methods
* init()
* refreshValue()
* getCurrentSize()

## Revision History
* **1.0.0:** First commit.