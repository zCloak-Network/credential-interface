import { Badge, Box, Drawer, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { AppContext } from '@credential/react-components';

import Cell from './Cell';
import { useUnread, useUnreadCount } from './useUnread';

interface Props {
  open: boolean;
  onClose: () => void;
}

const Notification: React.FC<Props> = ({ onClose, open }) => {
  const [type, setType] = useState(0);
  const { fetcher } = useContext(AppContext);
  const { allUnread, messageUnread, taskUnread } = useUnread();
  const counts = useUnreadCount();

  const messages = useMemo(
    () => (type === 0 ? allUnread : type === 1 ? taskUnread : messageUnread),
    [allUnread, messageUnread, taskUnread, type]
  );

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
              <Badge badgeContent={counts.allUnread} color="warning" max={99} variant="dot">
                All
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={counts.taskUnread} color="warning" max={99} variant="dot">
                Tasks
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={counts.messageUnread} color="warning" max={99} variant="dot">
                Messages
              </Badge>
            }
          />
        </Tabs>
      </Box>
      {messages?.map((message, index) => (
        <Cell
          body={message.body}
          isRead={!!message.isRead}
          key={index}
          onRead={() => {
            fetcher?.write.messages.read(message.messageId);
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
