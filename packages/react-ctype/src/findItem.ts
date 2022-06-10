import type React from 'react';
import type { ItemMap, ItemProps } from './types';

import { InstanceType } from '@credential/react-components/CTypeProvider/types';

import CTypeBool from './CTypeBool';
import CTypeInput from './CTypeInput';
import CTypeInputNumber from './CTypeInputNumber';

const itemMap: ItemMap = {
  string: CTypeInput,
  array: CTypeInput,
  object: CTypeInput,
  null: CTypeInput,
  number: CTypeInputNumber,
  integer: CTypeInputNumber,
  boolean: CTypeBool
};

export function findItem(type?: InstanceType): React.FC<ItemProps> {
  return itemMap[type || 'string'];
}
