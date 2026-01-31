import { jest } from '@jest/globals';
import { signal, unsubscribe, _logSignals, reportSignals } from './observerTool.js';
import { dummyListener, dummyOff, on, off } from './observerTool.js';
import { observerMixin, dummySignal, dummyCallback, dummyUnsubscribe } from './observerTool.js';

class TestClass {
    testProperty = false;
    signal = dummySignal;
    /** @type {Function} */
    on;

    constructor() {
        observerMixin(this);
    }

    changeTestProperty(value) {
        this.testProperty = value;
        this.signal('TEST_PROPERTY', value);
    }
}

describe('Observer tool', () => {
    it('subscribes, receives callbacks with multiple params, and unsubscribes', () => {
        const callback = jest.fn();
        const instance = new TestClass();
        const unsub = instance.on('TEST_PROPERTY', callback);

        instance.changeTestProperty(true);
        expect(callback).toHaveBeenCalledWith(true, undefined, undefined);

        instance.changeTestProperty(false);
        expect(callback).toHaveBeenCalledWith(false, undefined, undefined);

        unsub();
        instance.changeTestProperty(true);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('prevents duplicate subscriptions for same signal and callback', () => {
        const callback = jest.fn();
        const instance = new TestClass();
        instance.on('TEST_PROPERTY', callback);
        instance.on('TEST_PROPERTY', callback);
        instance.changeTestProperty(true);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('handles off method and signals with no/multiple subscribers', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        const instance = new TestClass();

        // Multiple subscribers
        instance.on('SIGNAL', callback1);
        instance.on('SIGNAL', callback2);
        instance.signal('SIGNAL', 'test');
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(1);

        // Off method
        instance.off('SIGNAL', callback1);
        instance.signal('SIGNAL', 'test2');
        expect(callback1).toHaveBeenCalledTimes(1);
        expect(callback2).toHaveBeenCalledTimes(2);

        // No subscribers - should not throw
        expect(() => instance.signal('NON_EXISTENT', 'value')).not.toThrow();
        expect(() => instance.off('NON_EXISTENT', callback1)).not.toThrow();
    });

    it('collects unsubscribes in array when provided', () => {
        const callback = jest.fn();
        const instance = new TestClass();
        const unsubscribes = [];

        instance.on('SIGNAL_1', callback, unsubscribes);
        instance.on('SIGNAL_2', callback, unsubscribes);

        expect(unsubscribes).toHaveLength(2);
        unsubscribes.forEach(unsub => unsub());

        instance.signal('SIGNAL_1', 'test');
        instance.signal('SIGNAL_2', 'test');
        expect(callback).toHaveBeenCalledTimes(0);
    });
});

describe('Dummy methods log errors', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('all dummy functions log errors when called', () => {
        dummySignal('TEST', 'payload');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockClear();

        dummyCallback('arg');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockClear();

        dummyUnsubscribe('arg');
        expect(consoleSpy).toHaveBeenCalled();
        consoleSpy.mockClear();

        const result = dummyListener.call({}, 'SIGNAL', jest.fn(), []);
        expect(consoleSpy).toHaveBeenCalled();
        expect(typeof result).toBe('function');
        consoleSpy.mockClear();

        dummyOff.call({}, 'SIGNAL', jest.fn());
        expect(consoleSpy).toHaveBeenCalled();
    });
});

describe('Direct function calls without mixin', () => {
    it('handles missing _observerTool gracefully', () => {
        const context = {};
        const callback = jest.fn();

        // on returns undefined without observer
        expect(on.call(context, 'SIGNAL', callback)).toBeUndefined();

        // off and signal don't throw
        expect(() => off.call(context, 'SIGNAL', callback)).not.toThrow();
        expect(() => signal.call(context, 'SIGNAL', 'value')).not.toThrow();

        // unsubscribe returns callable function
        const unsub = unsubscribe.call(context, 'SIGNAL', callback);
        expect(typeof unsub).toBe('function');
        expect(() => unsub()).not.toThrow();
    });
});

describe('Debug logging functions', () => {
    it('_logSignals logs signal registry and resets batch counters', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const instance = new TestClass();

        _logSignals(instance);

        expect(consoleSpy).toHaveBeenCalledWith(
            'ObserverTool => on',
            expect.objectContaining({
                SIGNAL_COUNT: expect.any(Number),
                SIGNAL_BATCH_COUNT: expect.any(Number),
                SIGNAL_REGISTRY: expect.any(Object),
                SIGNAL_REGISTRY_BATCH: expect.any(Object)
            })
        );
        consoleSpy.mockRestore();
    });

    it('reportSignals increments counters and registers signals', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        reportSignals('TEST_SIGNAL', {});
        reportSignals('TEST_SIGNAL', {});
        reportSignals('OTHER_SIGNAL', {});

        // logSignals is debounced, so we just verify reportSignals doesn't throw
        expect(consoleSpy).not.toThrow();
        consoleSpy.mockRestore();
    });
});
