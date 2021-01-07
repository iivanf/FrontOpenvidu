"use strict";
exports.__esModule = true;
exports.OpenViduLogger = void 0;
var OpenViduLogger = /** @class */ (function () {
    function OpenViduLogger() {
        this.logger = window.console;
        this.LOG_FNS = [this.logger.log, this.logger.debug, this.logger.info, this.logger.warn, this.logger.error];
        this.isProdMode = false;
    }
    OpenViduLogger.getInstance = function () {
        if (!OpenViduLogger.instance) {
            OpenViduLogger.instance = new OpenViduLogger();
        }
        return OpenViduLogger.instance;
    };
    OpenViduLogger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.LOG_FNS[0].apply(this.logger, arguments);
        }
    };
    OpenViduLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.LOG_FNS[1].apply(this.logger, arguments);
        }
    };
    OpenViduLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.LOG_FNS[2].apply(this.logger, arguments);
        }
    };
    OpenViduLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this.isProdMode) {
            this.LOG_FNS[3].apply(this.logger, arguments);
        }
    };
    OpenViduLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.LOG_FNS[4].apply(this.logger, arguments);
    };
    OpenViduLogger.prototype.enableProdMode = function () {
        this.isProdMode = true;
    };
    return OpenViduLogger;
}());
exports.OpenViduLogger = OpenViduLogger;
//# sourceMappingURL=OpenViduLogger.js.map