
jest.mock('@degjs/event-aggregator');

import breakpoints from '../src/breakpoints';
import initWindowMock from './__mocks__/window';
import eventAggregator from '@degjs/event-aggregator';

describe('breakpoints', () => {
    let breakpointsInst = null;

    beforeEach(() => {
        initWindowMock();
        const mockAttr = 'data-breakpoints-inited';
        document.body.setAttribute(mockAttr, 'false');
        breakpointsInst = breakpoints({
            size: 'small',
            initedAttributeName: mockAttr
        });
    })

    it('should have initial size', () => {
        expect(breakpointsInst.getCurrentSize()).toEqual('small');
    });

    it('should publish a breakpoint change', () => {
        global.setSize('large');
        global.resize();

        expect(eventAggregator.publish).toHaveBeenCalled();
    });

    it('should publish a breakpoint change with response', () => {
        const expectedVal = {
            type: 'breakpointChange',
            size: 'large',
            element: document.body
        }
        global.setSize('large');
        global.resize();

        expect(eventAggregator.publish).toHaveBeenCalledWith(expectedVal);
    })

    it('should have size after breakpoint change', () => {
        global.setSize('large');
        global.resize();
        expect(breakpointsInst.getCurrentSize()).toEqual('large');
    });
});