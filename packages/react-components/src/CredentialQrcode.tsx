import type { ICredential } from '@kiltprotocol/sdk-js';

import { Credential } from '@kiltprotocol/sdk-js';
import { Box } from '@mui/material';
import qrcode from 'qrcode-generator';
import React, { useEffect, useRef } from 'react';

function CredentialQrcode({
  cellSize = 5,
  credential
}: {
  cellSize?: number;
  credential: ICredential;
}) {
  const qr = useRef(qrcode(0, 'L'));
  const container = useRef<HTMLDivElement>();

  useEffect(() => {
    const compressCredential = Credential.fromCredential(credential).compress();

    qr.current = qrcode(0, 'L');

    qr.current.addData(JSON.stringify(compressCredential));
    qr.current.make();
    if (container.current) container.current.innerHTML = qr.current.createImgTag(cellSize);
  }, [cellSize, credential]);

  return <Box className="CredentialQrcode" ref={container} />;
}

export default React.memo(CredentialQrcode);
