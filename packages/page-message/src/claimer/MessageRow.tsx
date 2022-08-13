import type { MessageBody } from '@kiltprotocol/types';

import { TableRow } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { Message } from '@credential/app-db/message';
import { AppContext } from '@credential/react-components';

function MessageRow({
  children,
  message,
  onClick
}: {
  message: Message<MessageBody>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { fetcher } = useContext(AppContext);

  const handleClick = useCallback(() => {
    fetcher?.write.messages.read(message.messageId);
    onClick?.();
  }, [fetcher?.write.messages, message.messageId, onClick]);

  return (
    <>
      <TableRow hover onClick={handleClick}>
        {children}
      </TableRow>
    </>
  );
}

export default React.memo(MessageRow);
