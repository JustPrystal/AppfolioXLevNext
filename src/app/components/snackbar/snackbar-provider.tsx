import React, { useRef, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { closeSnackbar, SnackbarProvider as NotistackProvider } from 'notistack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarOrigin } from 'notistack';

import { StyledIcon, StyledNotistack } from './styles';

interface SnackbarProviderProps {
  children: ReactNode;
}

export default function SnackbarProvider({ children }: SnackbarProviderProps) {
  const notistackRef = useRef<any>(null);

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={12000}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' } as SnackbarOrigin}
      iconVariant={{
        info: (
          <StyledIcon color="info">
            info
          </StyledIcon>
        ),
        success: (
          <StyledIcon color="success">
            success
          </StyledIcon>
        ),
        warning: (
          <StyledIcon color="warning">
            WARNING
          </StyledIcon>
        ),
        error: (
          <StyledIcon color="error">
           <ErrorOutlineIcon />
          </StyledIcon>
        ),
      }}
      Components={{
        default: StyledNotistack,
        info: StyledNotistack,
        success: StyledNotistack,
        warning: StyledNotistack,
        error: StyledNotistack,
      }}
      // with close as default
      action={(snackbarId) => (
        <IconButton size="small" onClick={() => closeSnackbar(snackbarId)} sx={{ p: 0.5 }}>
          <CloseIcon />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  );
}

SnackbarProvider.propTypes = {
  children: PropTypes.node,
};
