import twilio from 'twilio';
import {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN
} from './index.js';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
export default client;
