import { Credential, ICredential } from '@kiltprotocol/sdk-js';
import React, { useCallback, useState } from 'react';

import { CredentialModal, QrScanner } from '@credential/react-components';
import { useToggle } from '@credential/react-hooks';

function CredentialScanner({ onClose }: { onClose: () => void }) {
  const [credential, setCredential] = useState<ICredential>();
  const [open, toggleOpen] = useToggle();

  const onResult = useCallback(
    (result: string) => {
      try {
        const json = JSON.parse(result);
        const credential = Credential.decompress(json);

        setCredential(credential);
        toggleOpen();
      } catch {}
    },
    [toggleOpen]
  );

  return open && credential ? (
    <CredentialModal credential={credential} onClose={onClose} />
  ) : (
    <QrScanner onClose={onClose} onResult={onResult} />
  );
}

export default React.memo(CredentialScanner);
