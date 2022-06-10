import type React from 'react';

import type { InstanceType } from '@credential/react-components/CTypeProvider/types';

export interface ItemProps {
  name: string;
  type?: InstanceType;
  defaultValue?: unknown;
  onChange?: (key: string, value: unknown) => void;
}

export type ItemMap = Record<InstanceType, React.FC<ItemProps>>;
