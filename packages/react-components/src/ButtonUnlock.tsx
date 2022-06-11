import React from 'react';

import { useToggle } from '@credential/react-hooks';

import ButtonWithError, { Props as ButtonWithErrorProps } from './ButtonWithError';
import { useDids } from './DidsProvider';
import UnlockModal from './UnlockModal';

interface Props extends ButtonWithErrorProps {
  unlockText?: string;
}

const ButtonUnlock: React.FC<Props> = ({ children, unlockText, ...props }) => {
  const [open, toggle] = useToggle();
  const { dids } = useDids();

  return (
    <>
      {!dids.isLocked ? (
        <ButtonWithError {...props}>{children}</ButtonWithError>
      ) : (
        <ButtonWithError {...props} onClick={toggle} variant="contained">
          {unlockText ?? 'Unlock wallet'}
        </ButtonWithError>
      )}
      <UnlockModal onClose={toggle} open={open} />
    </>
  );
};

export default React.memo<typeof ButtonUnlock>(ButtonUnlock);
