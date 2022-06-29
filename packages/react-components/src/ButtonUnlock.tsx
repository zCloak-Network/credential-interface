import React, { useCallback } from 'react';

import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import ButtonWithError, { Props as ButtonWithErrorProps } from './ButtonWithError';
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
  const { isLocked } = useKeystore();

  const onUnlock = useCallback(() => {
    toggle();

    if (triggerUnlocked) {
      props.onClick?.();
    }
  }, [props, toggle, triggerUnlocked]);

  return (
    <>
      <ButtonWithError {...props} onClick={isLocked ? toggle : props.onClick}>
        {isLocked ? unlockText ?? 'Unlock Account' : children}
      </ButtonWithError>
      <UnlockModal onClose={toggle} onUnlock={onUnlock} open={open} />
    </>
  );
};

export default React.memo<typeof ButtonUnlock>(ButtonUnlock);
