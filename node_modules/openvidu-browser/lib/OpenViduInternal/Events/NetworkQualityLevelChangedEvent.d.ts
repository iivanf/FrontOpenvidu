import { Event } from './Event';
import { Session } from '../../OpenVidu/Session';
import { Connection } from '../../OpenVidu/Connection';
/**
 * **This feature is part of OpenVidu Pro tier** <a href="https://docs.openvidu.io/en/stable/openvidu-pro/" target="_blank" style="display: inline-block; background-color: rgb(0, 136, 170); color: white; font-weight: bold; padding: 0px 5px; margin-right: 5px; border-radius: 3px; font-size: 13px; line-height:21px; font-family: Montserrat, sans-serif">PRO</a>
 *
 * Defines event `networkQualityLevelChanged` dispatched by [[Session]].
 * This event is fired when the network quality level of a [[Connection]] changes. See [network quality](/en/stable/advanced-features/network-quality/)
 */
export declare class NetworkQualityLevelChangedEvent extends Event {
    /**
     * New value of the network quality level
     */
    newValue: number;
    /**
     * Old value of the network quality level
     */
    oldValue: number;
    /**
     * Connection for whom the network quality level changed
     */
    connection: Connection;
    /**
     * @hidden
     */
    constructor(target: Session, newValue: number, oldValue: number, connection: Connection);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
