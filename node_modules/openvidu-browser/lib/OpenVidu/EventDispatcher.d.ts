import { Event as Event } from '../OpenViduInternal/Events/Event';
import EventEmitter = require('wolfy87-eventemitter');
export declare abstract class EventDispatcher {
    /**
     * @hidden
     */
    userHandlerArrowHandler: WeakMap<(event: Event) => void, (event: Event) => void>;
    /**
     * @hidden
     */
    ee: EventEmitter;
    /**
     * Adds function `handler` to handle event `type`
     *
     * @returns The EventDispatcher object
     */
    abstract on(type: string, handler: (event: Event) => void): EventDispatcher;
    /**
     * Adds function `handler` to handle event `type` just once. The handler will be automatically removed after first execution
     *
     * @returns The object that dispatched the event
     */
    abstract once(type: string, handler: (event: Event) => void): EventDispatcher;
    /**
     * Removes a `handler` from event `type`. If no handler is provided, all handlers will be removed from the event
     *
     * @returns The object that dispatched the event
     */
    off(type: string, handler?: (event: Event) => void): EventDispatcher;
    /**
     * @hidden
     */
    onAux(type: string, message: string, handler: (event: Event) => void): EventDispatcher;
    /**
     * @hidden
     */
    onceAux(type: string, message: string, handler: (event: Event) => void): EventDispatcher;
}
