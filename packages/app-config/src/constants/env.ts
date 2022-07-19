export const env: {
  CREDENTIAL_SERVICE: string;
  ZKID_SERVICE: string;
  MESSAGE_WS_URL: string;
} = {
  CREDENTIAL_SERVICE:
    (process.env.CREDENTIAL_SERVICE as string) || 'https://credential-service.starks.network',
  ZKID_SERVICE: (process.env.ZKID_SERVICE as string) || 'https://zkid-service.starks.network',
  MESSAGE_WS_URL:
    (process.env.MESSAGE_WS_URL as string) || 'wss://wss.credential-service.starks.network'
};
