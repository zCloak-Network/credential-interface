import React, { useCallback } from 'react';

import { useToggle } from '@credential/react-hooks';

import ButtonWithError, { Props as ButtonWithErrorProps } from './ButtonWithError';
import { useDids } from './DidsProvider';
import UnlockModal from './UnlockModal';

interface Props extends ButtonWithErrorProps {
  unlockText?: string;
  triggerUnlocked?: boolean;
  onClick?: () => void;
}

const ButtonUnlock: React.FC<Props> = ({
  children,
  triggerUnlocked = false,
  unlockText,
  ...props
}) => {
  const [open, toggle] = useToggle();
  const { dids } = useDids();

  const onUnlock = useCallback(() => {
    toggle();

    if (triggerUnlocked) {
      props.onClick?.();
    }
  }, [props, toggle, triggerUnlocked]);

  return (
    <>
      <ButtonWithError {...props} onClick={dids.isLocked ? toggle : props.onClick}>
        {dids.isLocked ? unlockText ?? 'Unlock Account' : children}
      </ButtonWithError>
      <UnlockModal onClose={toggle} onUnlock={onUnlock} open={open} />
    </>
  );
};

export default React.memo<typeof ButtonUnlock>(ButtonUnlock);
