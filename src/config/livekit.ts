import { RoomServiceClient } from 'livekit-server-sdk';

const url = process.env.LIVEKIT_URL ?? '';
const apiKey = process.env.LIVEKIT_API_KEY ?? '';
const apiSecret = process.env.LIVEKIT_API_SECRET ?? '';

export const livekitClient = new RoomServiceClient(url, apiKey, apiSecret);
