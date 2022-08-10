import type { ICredential, ISubmitCredential } from '@kiltprotocol/types';

import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useContext, useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import {
  AppContext,
  CredentialModal,
  CredentialStatus,
  CTypeName
} from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';
import { RequestStatus } from '@credential/react-hooks/types';

const MessageRow: React.FC<{
  message: Message<ISubmitCredential>;
}> = ({ message }) => {
  const { fetcher } = useContext(AppContext);
  const [credentialOpen, toggleCredential] = useToggle();
  const credential = useMemo(
    (): ICredential | undefined => message.body.content[0] ?? undefined,
    [message.body.content]
  );

  const handleClick = useCallback(() => {
    credential && toggleCredential();
    fetcher?.write.messages.read(message.messageId);
  }, [credential, fetcher, message.messageId, toggleCredential]);

  return (
    <>
      <TableRow hover onClick={handleClick}>
        <TableCell>{message.body.type}</TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.sender} />
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>{credential?.request.rootHash}</Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={credential?.attestation.cTypeHash} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.receiver} />
          </Box>
        </TableCell>
        <TableCell>
          <CredentialStatus
            revoked={credential?.attestation?.revoked}
            role="attester"
            showText
            status={RequestStatus.SUBMIT}
          />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </TableRow>
      {credentialOpen && credential && (
        <CredentialModal credential={credential} onClose={toggleCredential} />
      )}
    </>
  );
};

export default React.memo(MessageRow);
