import { CredentialApi } from '@zcloak/service';

import { env } from '@credential/app-config/constants/env';

export const credentialApi = new CredentialApi(env.CREDENTIAL_SERVICE);
