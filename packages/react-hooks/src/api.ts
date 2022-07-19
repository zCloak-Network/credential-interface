import { CredentialApi } from '@zcloak/service';

import { endpoint } from '@credential/app-config/endpoints';

export const credentialApi = new CredentialApi(endpoint.service);
