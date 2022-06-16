import React, { useContext, useMemo } from 'react';

import { CTypeContext } from './CTypeProvider';

const CTypeName: React.FC<{ cTypeHash: string }> = ({ cTypeHash }) => {
  const { cTypeList } = useContext(CTypeContext);

  const cType = useMemo(() => {
    return cTypeList.find((cType) => cType.hash === cTypeHash);
  }, [cTypeHash, cTypeList]);

  return <>{cType?.schema.title ?? cTypeHash}</>;
};

export default React.memo(CTypeName);
