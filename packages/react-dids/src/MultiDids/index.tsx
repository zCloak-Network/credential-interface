import { Dialog, DialogContent } from '@mui/material';
import React, { useState } from 'react';

import { DialogHeader } from '@credential/react-components';

import Main from './Main';

function MultiDids({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'restore' | 'create'>();

  return <Main onClose={onClose} />;
}

export default React.memo(MultiDids);
