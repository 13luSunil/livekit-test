import dotenv from 'dotenv';

dotenv.config();

const { livekitClient } = require('./config/livekit');

export const placeholder = (): void => {
  console.log('LiveKit client ready?', !!livekitClient);
};

if (require.main === module) {
  placeholder();
}
