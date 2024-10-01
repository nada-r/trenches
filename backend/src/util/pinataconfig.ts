import { PinataSDK } from 'pinata-web3';

export function setupPinata() {
  const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.GATEWAY_URL,
  });
return pinata;
}
