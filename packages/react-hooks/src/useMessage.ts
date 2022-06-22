import { useLiveQuery } from 'dexie-react-hooks';

import { CredentialData } from '@credential/app-db';

import { useDebounce } from '.';

export function useMessage(db: CredentialData, messageId: string) {
  const data = useLiveQuery(() =>
    db.message.get({
      messageId
    })
  );

  return useDebounce(data, 300);
}
