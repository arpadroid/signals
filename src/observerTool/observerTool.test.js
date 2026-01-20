import { jest } from '@jest/globals';
import { observerMixin, dummySignal } from './observerTool.js';

class TestClass {
    testProperty = false;
    signal = dummySignal;
    /** @type {Function} */
    on;

    constructor() {
        observerMixin(this);
    }

    /**
     * Changes the test property and signals the change.
     * @param {boolean} value
     * @returns {void}
     */
    changeTestProperty(value) {
        this.testProperty = value;
        this.signal('TEST_PROPERTY', value);
    }
}

describe('Observer tool', () => {
    it('Subscribes to a property, receives callbacks and unsubscribes', () => {
        const callback = jest.fn();
        const instance = new TestClass();
        const unsubscribe = instance.on('TEST_PROPERTY', callback);

        instance.changeTestProperty(true);
        expect(callback).toHaveBeenCalledWith(true, undefined, undefined);

        instance.changeTestProperty(false);
        expect(callback).toHaveBeenCalledWith(false, undefined, undefined);

        unsubscribe();
        expect(callback).toHaveBeenCalledTimes(2);

        instance.changeTestProperty(false);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('Checks that no duplicate subscribes are made for the same signal and callback for the instance', () => {
        const callback = jest.fn();
        const instance = new TestClass();
        const unsubscribe = instance.on('TEST_PROPERTY', callback);
        instance.on('TEST_PROPERTY', callback);
        instance.changeTestProperty(true);
        expect(callback).toHaveBeenCalledTimes(1);

        unsubscribe();
        instance.changeTestProperty(true);
        instance.changeTestProperty(true);
        instance.changeTestProperty(true);
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
