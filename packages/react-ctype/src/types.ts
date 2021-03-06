import type { InstanceType } from '@kiltprotocol/sdk-js';
import type React from 'react';

export interface ItemProps {
  name: string;
  disabled?: boolean;
  type?: InstanceType;
  defaultValue?: unknown;
  onChange?: (key: string, value: unknown) => void;
}

export type ItemMap = Record<InstanceType, React.FC<ItemProps>>;
