import type { ICredential } from '@kiltprotocol/sdk-js';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Typography
} from '@mui/material';
import React, { useMemo } from 'react';

interface Props {
  credential: ICredential;
}

const Wrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#272823',
  borderRadius: 10
}));

const CredentialDetail: React.FC<Props> = ({ credential }) => {
  const entries = useMemo(
    () => Object.entries(credential.request.claim.contents),
    [credential.request.claim.contents]
  );

  return (
    <Wrapper>
      {entries.map(([key, value]) => {
        return (
          <Accordion
            defaultExpanded
            key={key}
            sx={({ palette }) => ({
              background: 'transparent',
              color: 'white',
              border: '1px solid',
              borderColor: palette.grey[700]
            })}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
              <Typography sx={{ opacity: 0.8 }}>{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{typeof value !== 'string' ? JSON.stringify(value) : value}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Wrapper>
  );
};

export default React.memo(CredentialDetail);
