import { useRef } from 'react';
import PropTypes from 'prop-types';
import { closeSnackbar, SnackbarProvider as NotistackProvider } from 'notistack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


import { StyledIcon, StyledNotistack } from './styles';

// ----------------------------------------------------------------------

export default function SnackbarProvider({ children }) {
 
  const notistackRef = useRef(null);

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={12000}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      iconVariant={{
        info: (
          <StyledIcon color="info">
            info
          </StyledIcon>
        ),
        success: (
          <StyledIcon color="success">
            succcess
          </StyledIcon>
        ),
        warning: (
          <StyledIcon color="warning">
            WARNING
          </StyledIcon>
        ),
        error: (
          <StyledIcon color="error">
           <ErrorOutlineIcon></ErrorOutlineIcon>
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
