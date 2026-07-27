/**
 * Public contact channels. Override via env for production numbers.
 * NEXT_PUBLIC_WHATSAPP_NUMBER — digits only with country code, e.g. 254712345678
 */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '254700000000';

const defaultMessage =
  "Hi Devine Adventure — I'd like to know more about an adventure.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`;

export const CONTACT_EMAIL = 'hello@devineadventure.co.ke';
