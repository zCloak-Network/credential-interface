import { CType, Did } from '@kiltprotocol/sdk-js';
import { Button } from '@mui/material';
import React, { useCallback, useContext, useMemo } from 'react';

import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { addCtype, signAndSend, Steps } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const SubmitCType: React.FC<{
  title?: string;
  properties?: Record<string, { type: any }>;
  onDone: () => void;
  description?: string;
}> = ({ description, onDone, properties, title }) => {
  const [open, toggleOpen] = useToggle();
  const { keyring } = useKeystore();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);

  const ctype = useMemo(() => {
    if (!properties || !title) return null;

    try {
      return CType.fromSchema({
        title,
        $schema: 'http://kilt-protocol.org/draft-01/ctype#',
        type: 'object',
        properties
      });
    } catch (error) {
      return null;
    }
  }, [properties, title]);

  const getExtrinsic = useCallback(async () => {
    if (!ctype) {
      throw new Error('Ctype generate failed');
    }

    if (!(attester instanceof Did.FullDidDetails)) {
      throw new Error('The DID with the given identifier is not on chain.');
    }

    const tx = await ctype.getStoreTx();
    const extrinsic = await attester.authorizeExtrinsic(tx, keyring, attester.identifier);

    return extrinsic;
  }, [attester, ctype, keyring]);

  return (
    <>
      <Button onClick={toggleOpen} variant="contained">
        Submit
      </Button>
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={onDone}
            steps={[
              {
                label: 'Sign and submit ctype',
                paused: true,
                exec: (report) =>
                  signAndSend(report, keyring, attester?.authenticationKey.publicKey, getExtrinsic)
              },
              {
                label: 'Upload ctype',
                exec: () => addCtype(ctype, attester?.uri, description)
              }
            ]}
            submitText="Submit ctype"
          />
        }
        title="Submit ctype"
      />
    </>
  );
};

export default React.memo(SubmitCType);
