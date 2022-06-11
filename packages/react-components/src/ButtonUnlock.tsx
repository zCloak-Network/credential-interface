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
      <ButtonWithError {...props} onClick={dids.isLocked ? toggle : props.onClick}>
        {dids.isLocked ? unlockText ?? 'Unlock Account' : children}
      </ButtonWithError>
      <UnlockModal onClose={toggle} onUnlock={toggle} open={open} />
    </>
  );
};

export default React.memo<typeof ButtonUnlock>(ButtonUnlock);
