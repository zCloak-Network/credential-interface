import { CType } from '@kiltprotocol/sdk-js';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import {
  ButtonUnlock,
  DialogHeader,
  NotificationContext,
  useAttester
} from '@credential/react-components';
import { useLocalStorage, useToggle } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import CreateProperty from './CreateProperty';

const key = 'credential:ctype:draft';

const CreateCType: React.FC = () => {
  const [open, toggleOpen] = useToggle();
  const [cTypeContent, setCTypeContent, clear] = useLocalStorage<{
    title?: string;
    description?: string;
    properties?: Record<string, string>;
  }>(key);
  const { attester } = useAttester();
  const { notifyError } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  const createCType = useCallback(async () => {
    try {
      if (!attester.isFullDid) {
        throw new Error('The DID with the given identifier is not on chain.');
      }

      const fullDid = attester.didDetails;

      if (cTypeContent?.title && cTypeContent?.description && cTypeContent?.properties) {
        setLoading(true);
        const title = cTypeContent.title;

        const properties = Object.entries(cTypeContent.properties)
          .map(([name, property]) => ({
            [name]: {
              type: property as any
            }
          }))
          .reduce((l, r) => ({ ...l, ...r }));

        const ctype = CType.fromSchema(
          {
            title,
            $schema: 'http://kilt-protocol.org/draft-01/ctype#',
            type: 'object',
            properties
          },
          fullDid.uri
        );

        await attester.createCType(ctype);

        await credentialApi.addCType({
          owner: fullDid.uri,
          ctypeHash: ctype.hash,
          metadata: ctype.schema
        });
        clear();
        toggleOpen();
      }
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [cTypeContent, attester, clear, toggleOpen, notifyError]);

  return (
    <>
      <Dialog fullScreen open={open}>
        <DialogHeader onClose={toggleOpen}>Create ctype</DialogHeader>
        <Container component={DialogContent} maxWidth="lg">
          <Container component={Stack} maxWidth="sm" spacing={3} sx={{ paddingY: 7 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Ctype title</InputLabel>
              <OutlinedInput
                defaultValue={cTypeContent?.title}
                onChange={(e) =>
                  setCTypeContent((value) => ({
                    ...value,
                    title: e.target.value
                  }))
                }
              />
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Description</InputLabel>
              <OutlinedInput
                defaultValue={cTypeContent?.description}
                minRows={6}
                multiline
                onChange={(e) => {
                  setCTypeContent((value) => ({
                    ...value,
                    description: e.target.value
                  }));
                }}
              />
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Data</InputLabel>
              <Box sx={{ textAlign: 'right' }}>
                <CreateProperty
                  onCreate={(property) => {
                    setCTypeContent((value) => ({
                      ...value,
                      properties: Object.assign(value?.properties ?? {}, property)
                    }));
                  }}
                />
                <TableContainer
                  sx={({ palette }) => ({
                    border: '1px solid',
                    borderColor: palette.grey[400],
                    marginTop: 4,
                    borderRadius: 1
                  })}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Data Name</TableCell>
                        <TableCell>Property</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(cTypeContent?.properties ?? {}).map(([name, property]) => (
                        <TableRow key={name}>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                setCTypeContent((value) => {
                                  if (value?.properties?.[name]) {
                                    delete value.properties[name];
                                  }

                                  return { ...value, properties: { ...value.properties } };
                                })
                              }
                            >
                              <IndeterminateCheckBoxOutlinedIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell>{name}</TableCell>
                          <TableCell>{property}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </FormControl>
          </Container>
        </Container>
        <DialogActions>
          <Button variant="outlined">Save</Button>
          <ButtonUnlock loading={loading} onClick={createCType} variant="contained">
            Submit
          </ButtonUnlock>
        </DialogActions>
      </Dialog>
      <Button onClick={toggleOpen} startIcon={<AddBoxOutlinedIcon />} variant="contained">
        Create ctype
      </Button>
    </>
  );
};

export default CreateCType;
