import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Grid, makeStyles } from "@material-ui/core";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import useQueues from "../../hooks/useQueues";
import UserStatusIcon from "../UserModal/statusIcon";
import { isNil } from "lodash";
import CancelIcon from '@mui/icons-material/Cancel';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const useStyles = makeStyles((theme) => ({
  maxWidth: {
    width: "100%",
  },
  modernTextField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#262626",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#404040",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#525252",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#437db5",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#b3b3b3",
      "&.Mui-focused": {
        color: "#437db5",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
      fontSize: "14px",
    },
  },
  modernSelect: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#262626",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#404040",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#525252",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#437db5",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#b3b3b3",
      "&.Mui-focused": {
        color: "#437db5",
      },
    },
    "& .MuiSelect-select": {
      color: "#ffffff",
      fontSize: "14px",
    },
    "& .MuiSvgIcon-root": {
      color: "#b3b3b3",
    },
  },
  modernAutocomplete: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#262626",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "#404040",
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: "#525252",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#437db5",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#b3b3b3",
      "&.Mui-focused": {
        color: "#437db5",
      },
    },
    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
      fontSize: "14px",
    },
    "& .MuiAutocomplete-popupIndicator": {
      color: "#b3b3b3",
    },
    "& .MuiAutocomplete-clearIndicator": {
      color: "#b3b3b3",
    },
  },
}));

const filterOptions = createFilterOptions({
  trim: true,
});

const TransferTicketModalCustom = ({ modalOpen, onClose, ticketid, ticket }) => {
  const history = useHistory();
  const [options, setOptions] = useState([]);
  const [queues, setQueues] = useState([]);
  const [allQueues, setAllQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState("");
  const classes = useStyles();
  const { findAll: findAllQueues } = useQueues();
  const isMounted = useRef(true);
  const [msgTransfer, setMsgTransfer] = useState('');

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      const loadQueues = async () => {
        const list = await findAllQueues();
        setAllQueues(list);
        setQueues(list);

      };
      loadQueues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!modalOpen || searchParam.length < 3) {
      setLoading(false);
      setSelectedQueue("");
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      const fetchUsers = async () => {
        try {
          const { data } = await api.get("/users/", {
            params: { searchParam },
          });
          setOptions(data.users);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };

      fetchUsers();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, modalOpen]);

  const handleMsgTransferChange = (event) => {
    setMsgTransfer(event.target.value);
  };

  const handleClose = () => {
    onClose();
    setSearchParam("");
    setSelectedUser(null);
  };

  const handleSaveTicket = async (e) => {
    // e.preventDefault();
    if (!ticketid) return;
    if (!selectedQueue || selectedQueue === "") return;
    setLoading(true);
    try {
      let data = {};

        data.userId = !selectedUser ? null : selectedUser.id;
        data.status = !selectedUser ? "pending" : ticket.isGroup ? "group" : "open";
        data.queueId = selectedQueue;
        data.msgTransfer = msgTransfer ? msgTransfer : null;
        data.isTransfered = true;

      await api.put(`/tickets/${ticketid}`, data);
      setLoading(false);
      history.push(`/tickets/`);
      handleClose();
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };


  return (
    <Dialog 
      open={modalOpen} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth 
      scroll="paper"
      hideBackdrop={true}
      PaperProps={{
        style: {
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid #404040",
          borderRadius: "16px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
        }
      }}
    >
      {/* <form onSubmit={handleSaveTicket}> */}
      <DialogTitle 
        id="form-dialog-title"
        style={{
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
          borderBottom: "1px solid #333333",
          padding: "20px 24px",
          fontSize: "18px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <SwapHorizIcon style={{ color: "#437db5", fontSize: "24px" }} />
        {i18n.t("transferTicketModal.title")}
      </DialogTitle>
      <DialogContent 
        dividers
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          borderColor: "#333333",
          padding: "24px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} xl={6}>
            <Autocomplete
              className={classes.modernAutocomplete}
              fullWidth
              getOptionLabel={(option) => `${option.name}`}
              onChange={(e, newValue) => {
                setSelectedUser(newValue);
                if (newValue != null && Array.isArray(newValue.queues)) {
                  if (newValue.queues.length === 1) {
                    setSelectedQueue(newValue.queues[0].id);
                  }
                  setQueues(newValue.queues);

                } else {
                  setQueues(allQueues);
                  setSelectedQueue("");
                }
              }}
              options={options}
              filterOptions={filterOptions}
              freeSolo
              autoHighlight
              noOptionsText={i18n.t("transferTicketModal.noOptions")}
              loading={loading}
              renderOption={option => (
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  padding: "8px 12px",
                  backgroundColor: "#262626",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#333333",
                  }
                }}>
                  <UserStatusIcon user={option} /> 
                  <span style={{ marginLeft: "8px" }}>{option.name}</span>
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={i18n.t("transferTicketModal.fieldLabel")}
                  variant="outlined"
                  autoFocus
                  onChange={(e) => setSearchParam(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress 
                            style={{ color: "#437db5" }} 
                            size={20} 
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid xs={12} sm={6} xl={6} item >
            <FormControl variant="outlined" fullWidth className={classes.modernSelect}>
              <InputLabel>
                {i18n.t("transferTicketModal.fieldQueueLabel")}
              </InputLabel>
              <Select
                value={selectedQueue}
                onChange={(e) => setSelectedQueue(e.target.value)}
                label={i18n.t("transferTicketModal.fieldQueuePlaceholder")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      backgroundColor: "#262626",
                      border: "1px solid #404040",
                      borderRadius: "8px",
                    },
                  },
                }}
              >
                {queues.map((queue) => (
                  <MenuItem 
                    key={queue.id} 
                    value={queue.id}
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#262626",
                      "&:hover": {
                        backgroundColor: "#333333",
                      }
                    }}
                  >
                    {queue.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "8px" }}>
          <Grid item xs={12} sm={12} xl={12} >
            <TextField
              className={classes.modernTextField}
              label={i18n.t("transferTicketModal.msgTransfer")}
              value={msgTransfer}
              onChange={handleMsgTransferChange}
              variant="outlined"
              multiline
              maxRows={5}
              minRows={4}
              fullWidth
              placeholder="Digite uma mensagem para acompanhar a transferência..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: "#0a0a0a",
          borderTop: "1px solid #333333",
          padding: "20px 24px",
          gap: "12px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          startIcon={<CancelIcon />}
          onClick={handleClose}
          style={{
            color: "#ffffff",
            backgroundColor: "#dc3545",
            border: "1px solid #dc3545",
            borderRadius: "10px",
            fontSize: "13px",
            padding: "10px 20px",
            textTransform: "none",
            fontWeight: "500",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#c82333",
              transform: "translateY(-1px)",
            },
          }} 
          disabled={loading}
          variant="contained"
          size="medium"
        >
          {i18n.t("transferTicketModal.buttons.cancel")}
        </Button>
        <ButtonWithSpinner
          startIcon={<SwapHorizIcon />}
          variant="contained"
          type="submit"
          style={{
            color: "#ffffff",
            backgroundColor: "#437db5",
            border: "1px solid #437db5",
            borderRadius: "10px",
            fontSize: "13px",
            padding: "10px 20px",
            textTransform: "none",
            fontWeight: "500",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#3a6ba3",
              transform: "translateY(-1px)",
            },
          }}
          loading={loading}
          disabled={selectedQueue === ""}
          onClick={() => handleSaveTicket(selectedQueue)}
          size="medium"
        >
          {i18n.t("transferTicketModal.buttons.ok")}
        </ButtonWithSpinner>
      </DialogActions>
      {/* </form> */}
    </Dialog>
  );
};

export default TransferTicketModalCustom;
