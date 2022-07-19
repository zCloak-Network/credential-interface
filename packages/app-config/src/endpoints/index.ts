import { Endpoint } from './types';

const isRelease = location.hostname.includes('zkid.app');

export const endpoints: Record<string, Endpoint> = isRelease
  ? {
      'KILT Peregrine': {
        endpoint: 'wss://peregrine.kilt.io/parachain-public-ws/',
        service: 'https://testnet.credential-service.zkid.app',
        messageWs: 'wss://wss.testnet.credential-service.zkid.app/ws'
      },
      'KILT Spiritnet': {
        endpoint: 'wss://spiritnet.kilt.io/',
        service: 'https://spiritnet.credential-service.zkid.app',
        messageWs: 'wss://wss.spiritnet.credential-service.zkid.app/ws'
      }
    }
  : {
      'KILT Peregrine': {
        endpoint: 'wss://peregrine.kilt.io/parachain-public-ws/',
        service: 'https://credential-service.starks.network',
        messageWs: 'wss://wss.credential-service.starks.network/ws'
      }
    };

export function getEndpoint(): Endpoint {
  const localStr = localStorage.getItem('runs_on_env');

  if (localStr) {
    return endpoints[localStr] || endpoints['KILT Peregrine'];
  } else {
    return endpoints['KILT Peregrine'];
  }
}

export const endpoint = getEndpoint();
