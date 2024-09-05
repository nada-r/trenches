"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var dotenv_vault_1 = require("dotenv-vault");
var find_config_1 = require("find-config");
// Make sure all the Envs are loaded when launching the server
// add the new env under envVariables
var envVariables = zod_1.default.object({
    DATABASE_URL: zod_1.default.string(),
});
function error() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.error(args);
    return 1; // Stop the server from starting
}
function bootStrap() {
    return __awaiter(this, void 0, void 0, function () {
        var path, dotenvResult;
        return __generator(this, function (_a) {
            try {
                path = (0, find_config_1.default)('.env.vault');
                if (!path)
                    return [2 /*return*/, error("Failed to locate .env.vault")];
                dotenvResult = (0, dotenv_vault_1.config)({
                    DOTENV_KEY: process.env.DOTENV_KEY,
                    path: path
                });
                if (dotenvResult.error)
                    return [2 /*return*/, error("dotenv.config failed", error)];
                if (Object.keys(dotenvResult.parsed).length === 0)
                    return [2 /*return*/, error("No environment variables found in the parsed dotenv result")];
                envVariables.parse(dotenvResult.parsed);
                // if (!process.env.CORS)
                //   return error("CORS variable is missing from env");
                console.log(dotenvResult.parsed);
            }
            catch (e) {
                console.error(e);
                return [2 /*return*/, 1];
            }
            return [2 /*return*/, 0];
        });
    });
}
exports.default = bootStrap;
