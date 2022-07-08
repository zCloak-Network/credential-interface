import { Hash, MessageBodyType } from '@kiltprotocol/sdk-js';
import { Badge, Box, Drawer, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { DidsContext } from '@credential/react-dids';
import { useMessages } from '@credential/react-hooks';

import Cell from './Cell';
import { useUnread } from './useUnread';

interface Props {
  open: boolean;
  onClose: () => void;
  handleRequest?: (rootHash: Hash, isRequest: boolean) => void;
}

const Notification: React.FC<Props> = ({ handleRequest, onClose, open }) => {
  const { didUri } = useContext(DidsContext);
  const [type, setType] = useState(0);
  const { allUnread, messageUnread, taskUnread } = useUnread(credentialDb, didUri);

  const filter = useMemo(
    () =>
      didUri
        ? {
            receiver: didUri,
            bodyTypes:
              type === 0
                ? [
                    MessageBodyType.REQUEST_ATTESTATION,
                    MessageBodyType.SUBMIT_ATTESTATION,
                    MessageBodyType.REJECT_ATTESTATION,
                    MessageBodyType.SUBMIT_CREDENTIAL
                  ]
                : type === 1
                ? [MessageBodyType.REQUEST_ATTESTATION]
                : [
                    MessageBodyType.SUBMIT_ATTESTATION,
                    MessageBodyType.REJECT_ATTESTATION,
                    MessageBodyType.SUBMIT_CREDENTIAL
                  ]
          }
        : undefined,
    [didUri, type]
  );
  const messages = useMessages(credentialDb, filter);

  return (
    <Drawer anchor="right" onClose={onClose} open={open}>
      <Box
        sx={({ palette }) => ({
          minWidth: 532,
          background: palette.grey[100],
          paddingX: 3,
          paddingTop: 3
        })}
      >
        <Typography sx={{ fontWeight: 500 }}>Notification</Typography>
        <Tabs onChange={(_, value) => setType(value)} value={type}>
          <Tab
            label={
              <Badge badgeContent={allUnread} color="warning" max={99} variant="dot">
                All
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={taskUnread} color="warning" max={99} variant="dot">
                Tasks
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={messageUnread} color="warning" max={99} variant="dot">
                Messages
              </Badge>
            }
          />
        </Tabs>
      </Box>
      {messages?.map((message, index) => (
        <Cell
          body={message.body}
          handleClick={() => {
            if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
              handleRequest?.(message.body.content.requestForAttestation.rootHash, true);
            } else if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
              handleRequest?.(message.body.content.attestation.claimHash, false);
            } else if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
              handleRequest?.(message.body.content, false);
            } else if (message.body.type === MessageBodyType.SUBMIT_CREDENTIAL) {
              handleRequest?.(message.body.content[0].request.rootHash, false);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            credentialDb.message.update(message.id!, {
              isRead: 1
            });
          }}
          isRead={!!message.isRead}
          key={index}
          onRead={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            credentialDb.message.update(message.id!, {
              isRead: 1
            });
          }}
          receiver={message.receiver}
          sender={message.sender}
          time={message.createdAt}
        />
      ))}
    </Drawer>
  );
};

export default React.memo(Notification);
