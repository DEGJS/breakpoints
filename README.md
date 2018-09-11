# Breakpoints
[![Build Status](https://travis-ci.org/DEGJS/breakpoints.svg?branch=master)](https://travis-ci.org/DEGJS/breakpoints)

Breakpoints is a Javascript module that triggers a change event when CSS-defined breakpoints are crossed during a browser viewport resize. Changes to the ```content``` style property of a pseudo-element across CSS media queries are used to inform the breakpoints module as to when a breakpoint change event should be fired. 

## The Problem
Responsive websites often necessitate conditional Javascript that only runs at certain viewport sizes. This can lead to problems when you need to sync up viewport breakpoints across Javascript and CSS. An example: 

A component has a tabbed interface on larger viewports and an accordion interface on smaller viewports. At a certain breakpoint, let's say `48em` and smaller, Javascript should instantiate an accordion interface by applying an accordion Javascript plugin to the component. Above `48em`, Javascript should instantiate a tabbed interface by applying a tabs Javascript plugin to the component. 

To accomplish the above example, your Javascript would need to listen to the `window.resize` event and compare the viewport's width to the defined breakpoint of `48em`. This breakpoint would also exist in your CSS, as certain styles for the component and surrounding layout would likely be dependent on this `48em` size as well. This presents two problems:
- Your `48em` breakpoint must be defined and maintained in two separate areas, your CSS and Javascript
- The viewport width as determined by Javascript may not match exactly with the breakpoint defined in CSS. This is due to inconsistencies in how browsers determine the width of viewport if a vertical scrollbar is present. 

## A Solution
The Breakpoints module allows you to define and maintain your breakpoints for an element in one place: your CSS. It does this by relying on a pseudo-element tied to the element. This pseudo-element can have different `content` property values defined across media queries:
```css
.component:before {
    content: 'small';
    display: none;
}

@media (min-width: 48em) {
    .component:before {
        content: 'medium';
    }
}
```
Note: the above CSS is just an example, but it's a good idea to use values for `content` that are easily understandable. 

Every time the `window.resize` event fires, the Breakpoints module reads in the value of the `content` property of the pseudo-element. It keeps track of this value and fires a `breakpointChange` event when the value changes. In the above example, the `content` value changes from `'small'` to `'medium'` when the viewport resizes above `48em`.

The benefit of the Breakpoints module is that all of your component's breakpoints are defined in your CSS only, ensuring that your Javascript and CSS are always in sync.

## Install
Breakpoints is an ES6 module. Consequently, you'll need an ES6 transpiler ([Babel](https://babeljs.io) is a nice one).

Install breakpoints with NPM using the command:
```
$ npm install @degjs/breakpoints
```

## Dependencies
Breakpoints relies on the EventAggregator module to publish the `breakpointChange` event. Your Javascript code will also need to import the EventAggregator module in order to subscribe to this event. You can find out more about EventAggregator [here](https://github.com/DEGJS/eventAggregator).

## Usage
Sample Javascript:
```js
import breakpoints from "@degjs/breakpoints";
import eventAggregator from "@degjs/event-aggregator";

/* Function to handle breakpoint changes */
function onBreakpointChange(size) {
    console.log(size);
}

/* Instantiate the Breakpoints module on an element */
let instance = breakpoints({
    elementSelector: ".component"
});

/* Subscribe to the breakpointChange event */
eventAggregator.subscribe("breakpointChange", function(e) {
    onBreakpointChange(e.size);
});

/* If the current size is needed before a breakpointsChange event is fired, it can be retrieved from the Breakpoints instance */
let currentSize = instance.getCurrentSize();
onBreakpointChange(currentSize);
```

Sample CSS:
```css
.component:before {
    content: 'small';
    /* Hide the pseudo-element so that the text 'small' does not appear on screen */
    display: none;
}

@media (min-width: 48em) {
    .component:before {
        content: 'medium';
    }
}

@media (min-width: 64em) {
    .component:before {
        content: 'large';
    }
}
```


## Options

#### options.elementSelector
Type: `String`   
The CSS selector of the observed element. Either this property or the `element` property is required.

#### options.element
Type: `Element`   
The observed DOM element. Either this property or the `elementSelector` property is required.

#### options.pseudoElementSelector
Type: `String` Default: `:before`   
The pseudo-element that Breakpoints will use to determine the current size and when a breakpoint has been crossed. Possible values are `:before` and `:after`.

#### options.initedAttributeName
Type: `String` Default: `data-breakpoints-inited`   
The name of the attribute that gets added to the observed element when breakpoints has been instantiated on it. This is primarily to ensure that breakpoints does not get instantiated multiple times on the same element.

## Methods

### .getCurrentSize()
Parameters: none   
Returns the current size, which is the current value of the pseudo-element's `content` style property.

## Browser Support

Breakpoints depends on the following browser APIs:
+ [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

To support legacy browsers, you'll need to include polyfills for the above APIs.   
### IE8 Support
Breakpoints will not work with IE8 due to its lack of support for `window.computedStyle`, which Breakpoints uses to retrieve the `content` value of the pseudo-element. There are `window.computedStyle` polyfills available, but they are unable to retrieve pseudo-element `content` values. Breakpoints will log a warning message to the console and otherwise fail silently in IE8. Sorry.