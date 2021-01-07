import { Event } from './Event';
import { StreamManager } from '../../OpenVidu/StreamManager';
/**
 * Defines the following events:
 * - `streamPlaying`: dispatched by [[StreamManager]] ([[Publisher]] and [[Subscriber]]) whenever its media stream starts playing (one of its videos has media
 * and has begun to play). This event will be dispatched when these 3 conditions are met 1) The StreamManager has no video associated in the DOM 2) It is associated to one video 3) That video starts playing
 * - `streamAudioVolumeChange`: dispatched by [[StreamManager]] ([[Publisher]] and [[Subscriber]]) when the volume of its Stream's audio track
 * changes. Only applies if [[Stream.hasAudio]] is `true`. The frequency this event is fired with is defined by property `interval` of
 * [[OpenViduAdvancedConfiguration.publisherSpeakingEventsOptions]] (default 100ms)
 */
export declare class StreamManagerEvent extends Event {
    /**
     * For `streamAudioVolumeChange` event:
     * - `{newValue: number, oldValue: number}`: new and old audio volume values. These values are between -100 (silence) and 0 (loudest possible volume).
     * They are not exact and depend on how the browser is managing the audio track, but -100 and 0 can be taken as limit values.
     *
     * For `streamPlaying` event undefined
     */
    value: Object | undefined;
    /**
     * @hidden
     */
    constructor(target: StreamManager, type: string, value: Object | undefined);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
