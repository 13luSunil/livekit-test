import { EventEmitter } from 'events';
import twilio, { Twilio } from 'twilio';

export type CallState = 'ringing' | 'answered' | 'ended';

export interface CallEventEmitter extends EventEmitter {
  on(event: 'ringing', listener: (callSid: string) => void): this;
  on(event: 'answered', listener: (callSid: string) => void): this;
  on(event: 'ended', listener: (callSid: string) => void): this;
}

/**
 * Start an outbound call using the Twilio Voice API.
 * Returns an EventEmitter that notifies about call state.
 */
export function startOutboundCall(phoneNumber: string): CallEventEmitter {
  const accountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? '';
  const fromNumber = process.env.TWILIO_FROM_NUMBER ?? '';
  const twimlUrl = process.env.TWILIO_CALL_URL ?? '';

  const client: Twilio = twilio(accountSid, authToken);
  const emitter: CallEventEmitter = new EventEmitter();

  client.calls
    .create({ to: phoneNumber, from: fromNumber, url: twimlUrl })
    .then(call => {
      emitter.emit('ringing', call.sid);
      monitorCall(client, call.sid, emitter);
    })
    .catch(() => emitter.emit('ended', ''));

  return emitter;
}

function monitorCall(client: Twilio, sid: string, emitter: CallEventEmitter): void {
  const timer = setInterval(async () => {
    try {
      const call = await client.calls(sid).fetch();
      switch (call.status) {
        case 'in-progress':
          emitter.emit('answered', call.sid);
          break;
        case 'completed':
        case 'failed':
        case 'busy':
        case 'no-answer':
        case 'canceled':
          emitter.emit('ended', call.sid);
          clearInterval(timer);
          break;
      }
    } catch {
      emitter.emit('ended', sid);
      clearInterval(timer);
    }
  }, 2000);
}
