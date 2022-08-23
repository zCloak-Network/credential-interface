import type { ItemProps } from './types';

import React, { useMemo } from 'react';

import { findItem } from './findItem';

const CTypeItem: React.FC<ItemProps> = ({
  defaultValue,
  disabled = false,
  name,
  onChange,
  onError,
  type
}) => {
  const Component = useMemo(() => findItem(type), [type]);

  return (
    <Component
      defaultValue={defaultValue}
      disabled={disabled}
      name={name}
      onChange={onChange}
      onError={onError}
      type={type}
    />
  );
};

export default React.memo(CTypeItem);
