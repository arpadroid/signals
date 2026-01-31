/**
 * A set of functions that provide pub/sub functionality.
 * It acts as a mixin, and should be used as such via the mixin method.
 */
/**
 * @typedef {import('./observerTool.types.js').ObserverType} ObserverType
 * @typedef {import('./observerTool.types.js').ObserverInstanceType} ObserverInstanceType
 * @typedef {import('./observerTool.types.js').SignalType} SignalType
 * @typedef {import('./observerTool.types.js').UnsubscribeType} UnsubscribeType
 * @typedef {import('./observerTool.types.js').SignalCallBackType} SignalCallBackType
 * @typedef {import('./observerTool.types.js').ListenerType} ListenerType
 * @typedef {import('./observerTool.types.js').OffType} OffType
 */
import { debounce } from '@arpadroid/tools-iso';

//////////////////////////
// #region Logging
//////////////////////////
const VERBOSE = false;
/** @type {Record<string, number>} */
const SIGNAL_REGISTRY = {};
/** @type {Record<string, number>} */
let SIGNAL_REGISTRY_BATCH = {};
let SIGNAL_COUNT = 0;
let SIGNAL_BATCH_COUNT = 0;

/**
 * Logs signals to the console.
 * @param {ObserverType} instance
 */
export const _logSignals = instance => {
    console.log('ObserverTool => on', {
        SIGNAL_COUNT,
        SIGNAL_BATCH_COUNT,
        SIGNAL_REGISTRY,
        SIGNAL_REGISTRY_BATCH: { ...SIGNAL_REGISTRY_BATCH },
        CALLBACKS: instance?._observerTool?.callbacks
    });
    SIGNAL_REGISTRY_BATCH = {};
    SIGNAL_BATCH_COUNT = 0;
};

/** @type {(instance: Record<string, any>) => void} */
export const logSignals = debounce(_logSignals, 1000);

/**
 * Reports signals to the console.
 * @param {string} signalName
 * @param {Record<string, any>} instance
 */
export const reportSignals = (signalName, instance) => {
    SIGNAL_COUNT++;
    SIGNAL_BATCH_COUNT++;
    SIGNAL_REGISTRY[signalName] = SIGNAL_REGISTRY[signalName] || 0;
    SIGNAL_REGISTRY[signalName]++;
    SIGNAL_REGISTRY_BATCH[signalName] = SIGNAL_REGISTRY_BATCH[signalName] || 0;
    SIGNAL_REGISTRY_BATCH[signalName]++;
    logSignals(instance);
};

//////////////////////////
// #endregion
//////////////////////////
//////////////////////////
// #region Pubsub
//////////////////////////
/**
 * Subscribes to a signal.
 * @type {ListenerType}
 * @this {ObserverType}
 */
export function on(signalName, callback, unsubscribes) {
    const { callbacks = {} } = this._observerTool || {};
    if (!callbacks[signalName]) {
        callbacks[signalName] = new Set();
    }
    VERBOSE && reportSignals(signalName, this);
    if (typeof this.unsubscribe === 'function') {
        callbacks[signalName].add(callback);
        const unsubscribe = this.unsubscribe(signalName, callback);
        Array.isArray(unsubscribes) && unsubscribes.push(unsubscribe);
        return unsubscribe;
    }
}

/**
 * Unsubscribes from a signal.
 * @param {string} signalName
 * @param {SignalCallBackType} callback
 * @this {ObserverType}
 */
export function off(signalName, callback) {
    const { callbacks = {} } = this._observerTool || {};
    callbacks[signalName]?.delete(callback);
}

/**
 * Calls all subscribers of a signal.
 * @type {SignalType}
 * @this {ObserverType}
 */
export function signal(signalName, value, param1, param2) {
    const { callbacks = {} } = this._observerTool || {};
    if (signalName && callbacks[signalName]?.size) {
        for (const observer of callbacks[signalName]) {
            observer(value, param1, param2);
        }
    }
}

/**
 * Unsubscribes from a signal.
 * @param {string} signalName
 * @param {SignalCallBackType} callback
 * @returns {UnsubscribeType}
 * @this {ObserverType}
 */
export function unsubscribe(signalName, callback) {
    return () => {
        const { callbacks = {} } = this._observerTool || {};
        callbacks[signalName]?.delete(callback);
    };
}

/**
 * Binds the subscribe, callSubscribers, initializeSubscriptions and unsubscribeProperty methods to the instance.
 * @param {ObserverInstanceType} instance
 */
export function observerMixin(instance) {
    instance.on = on.bind(instance);
    instance.signal = signal.bind(instance);
    instance.unsubscribe = unsubscribe.bind(instance);
    instance.off = off.bind(instance);
    instance._observerTool = { callbacks: {} };
}

//////////////////////////
// #endregion
//////////////////////////

/////////////////////////////
// #region Dummy Methods
/////////////////////////////

const dummyText = 'This method should be overridden by the observerMixin method, if not there is a problem.';

/**
 * A dummy log method.
 * @param {...any} args
 * @returns {void}
 */
function logDummy(...args) {
    console.error(dummyText, { args });
}

/**
 * A dummy signal method.
 * @type {SignalType}
 */
export function dummySignal(signalName, ...payload) {
    logDummy(signalName, payload);
}

/**
 * A dummy callback method.
 * @type {SignalCallBackType}
 */
export function dummyCallback(...payload) {
    logDummy(payload);
}

/**
 * A dummy unsubscribe method.
 * @type {UnsubscribeType}
 */
export function dummyUnsubscribe(...payload) {
    logDummy(payload);
}

/**
 * A dummy listener method.
 * @type {ListenerType}
 * @this {ObserverType}
 */
export function dummyListener(signalName, callback, unsubscribes) {
    logDummy({ signalName, callback, unsubscribes });
    return dummyUnsubscribe;
}

/**
 * A dummy off method.
 * @type {OffType}
 * @this {ObserverType}
 */
export function dummyOff(signalName, callback) {
    logDummy({ signalName, callback });
}

/////////////////////////////
// #endregion
/////////////////////////////
