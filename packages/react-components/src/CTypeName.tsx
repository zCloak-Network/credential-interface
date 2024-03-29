import type { Hash } from '@kiltprotocol/sdk-js';

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Button } from '@mui/material';
import React, { useCallback, useContext, useMemo } from 'react';

import { CTypeContext } from './CTypeProvider';

const CTypeName: React.FC<{ cTypeHash?: Hash | null }> = ({ cTypeHash }) => {
  const { cTypeList } = useContext(CTypeContext);
  const { importCType } = useContext(CTypeContext);

  const cType = useMemo(() => {
    return cTypeList.find((cType) => cType.hash === cTypeHash);
  }, [cTypeHash, cTypeList]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (cTypeHash) {
        importCType(cTypeHash);
      }
    },
    [cTypeHash, importCType]
  );

  if (cType) {
    return <>{cType.schema.title}</>;
  }

  if (!cTypeHash) {
    return null;
  }

  return (
    <Button onClick={handleClick} startIcon={<FileUploadOutlinedIcon />} sx={{ padding: 0 }}>
      Import ctype
    </Button>
  );
};

export default React.memo(CTypeName);
