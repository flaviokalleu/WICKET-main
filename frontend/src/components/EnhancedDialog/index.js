import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      maxHeight: '90vh',
      margin: '32px',
      borderRadius: '8px',
      boxShadow: '0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)',
    },
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '16px 24px',
    margin: 0,
    fontWeight: 500,
    fontSize: '1.25rem',
    lineHeight: 1.6,
    letterSpacing: '0.0075em',
  },
  dialogContent: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: '20px 24px',
    overflowY: 'auto',
    flex: '1 1 auto',
  },
  dialogActions: {
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: '8px',
    justifyContent: 'flex-end',
    minHeight: '52px',
    display: 'flex',
    alignItems: 'center',
    '& > :not(:first-child)': {
      marginLeft: '8px',
    },
  },
}));

const EnhancedDialog = ({ children, title, actions, ...props }) => {
  const classes = useStyles();

  return (
    <Dialog {...props} className={classes.dialog}>
      {title && (
        <DialogTitle className={classes.dialogTitle}>
          {title}
        </DialogTitle>
      )}
      <DialogContent className={classes.dialogContent}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions className={classes.dialogActions}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default EnhancedDialog;
