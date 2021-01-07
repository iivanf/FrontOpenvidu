import { RemoteConnectionOptions } from './RemoteConnectionOptions';
export interface LocalConnectionOptions {
    id: string;
    createdAt: number;
    metadata: string;
    value: RemoteConnectionOptions[];
    session: string;
    sessionId: string;
    role: string;
    record: boolean;
    coturnIp: string;
    turnUsername: string;
    turnCredential: string;
    version: string;
}
