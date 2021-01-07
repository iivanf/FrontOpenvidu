export declare class OpenViduLogger {
    private static instance;
    private logger;
    private LOG_FNS;
    private isProdMode;
    private constructor();
    static getInstance(): OpenViduLogger;
    log(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    enableProdMode(): void;
}
