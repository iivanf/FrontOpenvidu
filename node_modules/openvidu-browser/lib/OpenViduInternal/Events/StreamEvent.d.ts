import { Event } from './Event';
import { Publisher } from '../../OpenVidu/Publisher';
import { Session } from '../../OpenVidu/Session';
import { Stream } from '../../OpenVidu/Stream';
/**
 * Defines the following events:
 * - `streamCreated`: dispatched by [[Session]] and [[Publisher]] after some user has started publishing to the session
 * - `streamDestroyed`: dispatched by [[Session]] and [[Publisher]] after some user has stopped publishing to the session
 */
export declare class StreamEvent extends Event {
    /**
     * Stream object that was created or destroyed
     */
    stream: Stream;
    /**
     * For 'streamDestroyed' event:
     * - "unpublish": method `Session.unpublish()` has been called
     * - "disconnect": method `Session.disconnect()` has been called
     * - "forceUnpublishByUser": some user has called `Session.forceUnpublish()` over the Stream
     * - "forceDisconnectByUser": some user has called `Session.forceDisconnect()` over the Stream
     * - "forceUnpublishByServer": the user's stream has been unpublished from the Session by the application
     * - "forceDisconnectByServer": the user has been evicted from the Session by the application
     * - "sessionClosedByServer": the Session has been closed by the application
     * - "networkDisconnect": the user's network connection has dropped
     * - "mediaServerDisconnect": OpenVidu Media Node has crashed or lost its connection. A new Media Node instance is active and no media streams are available in the Media Node
     *
     * For 'streamCreated' empty string
     */
    reason: string;
    /**
     * @hidden
     */
    constructor(cancelable: boolean, target: Session | Publisher, type: string, stream: Stream, reason: string);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
