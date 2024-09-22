"server only";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinata = void 0;
var pinata_web3_1 = require("pinata-web3");
var dotenv = require("dotenv");
dotenv.config();
exports.pinata = new pinata_web3_1.PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
});
