"server only"

import { PinataSDK } from "pinata-web3"
import * as dotenv from 'dotenv';

dotenv.config();

export const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL
  })
