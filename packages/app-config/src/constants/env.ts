export const env: {
  CREDENTIAL_SERVICE: string;
  ZKID_SERVICE: string;
} = {
  CREDENTIAL_SERVICE:
    (process.env.CREDENTIAL_SERVICE as string) || 'https://credential-service.zkid.app',
  ZKID_SERVICE: (process.env.ZKID_SERVICE as string) || 'https://zkid-service.zkid.app'
};
