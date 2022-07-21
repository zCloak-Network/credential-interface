import type { BN } from '@polkadot/util';

import { BalanceUtils } from '@kiltprotocol/sdk-js';
import React, { useMemo } from 'react';

interface Props {
  value?: BN | null;
  decimals?: number;
  forceUnit?: string;
  withSi?: boolean;
  withSiFull?: boolean;
  withUnit?: boolean | string;
  locale?: string;
}

const FormatBalance: React.FC<Props> = ({
  decimals,
  forceUnit,
  locale,
  value,
  withSi,
  withSiFull,
  withUnit
}) => {
  const str = useMemo(() => {
    return BalanceUtils.fromFemtoKilt(value ?? '0', decimals, {
      decimals,
      forceUnit,
      locale,
      withSi,
      withSiFull,
      withUnit
    });
  }, [decimals, forceUnit, locale, value, withSi, withSiFull, withUnit]);

  return <>{str}</>;
};

export default React.memo(FormatBalance);
