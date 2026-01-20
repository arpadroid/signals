/* eslint-disable @typescript-eslint/no-explicit-any */
export type SignalType = (
    signalName?: string,
    payload?: unknown,
    payload2?: unknown,
    payload3?: unknown
) => void;

export type SignalCallBackType = (...args: any[]) => void;

export type UnsubscribeType = () => void;

export type ListenerType = (
    signalName: string,
    callback: SignalCallBackType,
    unsubscribes?: UnsubscribeType[] | undefined
) => UnsubscribeType | undefined;

export type OffType = (signalName: string, callback: SignalCallBackType) => void;

export type ObserverType = {
    on?: ListenerType;
    off?: OffType;
    signal?: SignalType | undefined;
    unsubscribe?: (signalName: string, callback: SignalType) => UnsubscribeType;
    _observerTool?: ObserverStoreType;
};

export type ObserverStoreType = {
    callbacks?: Record<string, Set<SignalCallBackType>>;
};

export type ObserverInstanceType<T = any> = T &
    ObserverType & {
        [key: string]: any;
    };
