import React, { useState, useEffect, useRef } from "react";
import { parseISO, format } from "date-fns";
import * as Yup from "yup";
import { Formik, FieldArray, Form, Field } from "formik";
import { toast } from "react-toastify";
import { Paper, Slide } from "@mui/material";
import Draggable from "react-draggable";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Switch,
  Stack,
  Avatar,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Tooltip,
} from "@mui/material";

import {
  green,
  orange,
  red,
  blue,
  purple,
  teal,
  indigo,
} from "@mui/material/colors";
import {
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  DeleteOutline as DeleteOutlineIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  SmartToy as BotIcon,
  WhatsApp as WhatsAppIcon,
  Info as InfoIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { TagsContainer } from "../TagsContainer";

// Transition component for slide up effect
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Curto!")
    .max(250, "Longo!")
    .required("Obrigatótio"),
  number: Yup.string().min(8, "Curto!").max(50, "Longo!"),
  email: Yup.string().email("Email Inválido"),
});

const getRandomGradient = () => {
  const gradients = [
    `linear-gradient(135deg, ${indigo[500]}, ${teal[500]})`,
    `linear-gradient(135deg, ${purple[500]}, ${blue[500]})`,
    `linear-gradient(135deg, ${teal[500]}, ${green[500]})`,
    `linear-gradient(135deg, ${orange[500]}, ${red[500]})`,
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const ContactModal = ({ open, onClose, contactId, initialValues, onSave }) => {
  const isMounted = useRef(true);
  const [gradient] = useState(getRandomGradient());

  const initialState = {
    name: "",
    number: "",
    email: "",
    disableBot: false,
    lgpdAcceptedAt: "",
  };

  const [contact, setContact] = useState(initialState);
  const [disableBot, setDisableBot] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      if (initialValues) {
        setContact((prevState) => ({
          ...prevState,
          ...initialValues,
        }));
      }

      if (!contactId) return;

      try {
        const { data } = await api.get(`/contacts/${contactId}`);
        if (isMounted.current) {
          setContact(data);
          setDisableBot(data.disableBot);
        }
      } catch (err) {
        toastError(err);
      }
    };

    fetchContact();
  }, [contactId, open, initialValues]);

  const handleClose = () => {
    onClose();
    setContact(initialState);
  };

  const handleSaveContact = async (values) => {
    try {
      if (contactId) {
        await api.put(`/contacts/${contactId}`, { ...values, disableBot });
        handleClose();
      } else {
        const { data } = await api.post("/contacts", { ...values, disableBot });
        if (onSave) onSave(data);
        handleClose();
      }
      toast.success(i18n.t("contactModal.success"));
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          minHeight: "500px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
        },
      }}
      hideBackdrop={true}
    >
      <DialogTitle
        id="draggable-dialog-title"
        sx={{
          backgroundColor: "#000000",
          color: "#ffffff",
          cursor: "move",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mr: 2 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            {contactId
              ? i18n.t("contactModal.title.edit")
              : i18n.t("contactModal.title.add")}
          </Typography>
        </Box>
        <Chip
          label={contactId ? "Edição" : "Criação"}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: "bold",
          }}
        />
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#1a1a1a", p: 0 }}>
        <Formik
          initialValues={contact}
          enableReinitialize
          validationSchema={ContactSchema}
          onSubmit={(values, actions) => {
            handleSaveContact(values);
            actions.setSubmitting(false);
          }}
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    color: indigo[700],
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <PaletteIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                  {i18n.t("contactModal.form.mainInfo")}
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      label={i18n.t("contactModal.form.name")}
                      name="name"
                      fullWidth
                      autoFocus
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="filled"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiFilledInput-root": {
                          bgcolor: "#2a2a2a",
                          borderRadius: "8px",
                          color: "#ffffff",
                          "&:hover": {
                            bgcolor: "#333333",
                          },
                          "&.Mui-focused": {
                            bgcolor: "#333333",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#cccccc",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#437db5",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      label={i18n.t("contactModal.form.number")}
                      name="number"
                      fullWidth
                      error={touched.number && Boolean(errors.number)}
                      helperText={touched.number && errors.number}
                      variant="filled"
                      placeholder="5519971395449"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: "#437db5" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiFilledInput-root": {
                          bgcolor: "#2a2a2a",
                          borderRadius: "8px",
                          color: "#ffffff",
                          "&:hover": {
                            bgcolor: "#333333",
                          },
                          "&.Mui-focused": {
                            bgcolor: "#333333",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#cccccc",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#437db5",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label={i18n.t("contactModal.form.email")}
                      name="email"
                      fullWidth
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      variant="filled"
                      placeholder="email@example.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: "#437db5" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiFilledInput-root": {
                          bgcolor: "#2a2a2a",
                          borderRadius: "8px",
                          color: "#ffffff",
                          "&:hover": {
                            bgcolor: "#333333",
                          },
                          "&.Mui-focused": {
                            bgcolor: "#333333",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#cccccc",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#437db5",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TagsContainer contact={contact} />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "#2a2a2a",
                    borderRadius: "8px",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <BotIcon
                        sx={{
                          color: disableBot ? red[500] : green[500],
                          mr: 1,
                        }}
                      />
                      <Typography variant="subtitle1">
                        {i18n.t("contactModal.form.chatBotContact")}
                      </Typography>
                      <Tooltip title="Habilitar/desabilitar interações do chatbot para este contato">
                        <InfoIcon
                          sx={{ ml: 1, color: "text.secondary", fontSize: "1rem" }}
                        />
                      </Tooltip>
                    </Box>
                    <Switch
                      size="medium"
                      checked={disableBot}
                      onChange={() => setDisableBot(!disableBot)}
                      color={disableBot ? "error" : "success"}
                      sx={{
                        "& .MuiSwitch-thumb": {
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                        "& .MuiSwitch-track": {
                          bgcolor: disableBot ? red[300] : green[300],
                        },
                      }}
                    />
                  </Stack>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: "#2a2a2a",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, display: "flex", alignItems: "center", color: "#ffffff" }}
                  >
                    <WhatsAppIcon
                      sx={{
                        color: green[500],
                        mr: 1,
                      }}
                    />
                    {i18n.t("contactModal.form.whatsapp")}
                    <Chip
                      label={
                        contact?.whatsapp ? contact?.whatsapp.name : "Not linked"
                      }
                      size="small"
                      sx={{ 
                        ml: 1,
                        backgroundColor: contact?.whatsapp ? green[500] : "#555555",
                        color: "#ffffff"
                      }}
                    />
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    sx={{ display: "flex", alignItems: "center", color: "#ffffff" }}
                  >
                    <InfoIcon
                      sx={{
                        color: blue[500],
                        mr: 1,
                      }}
                    />
                    {i18n.t("contactModal.form.termsLGDP")}
                    <Chip
                      label={
                        contact?.lgpdAcceptedAt
                          ? format(
                              new Date(contact?.lgpdAcceptedAt),
                              "dd/MM/yyyy 'às' HH:mm"
                            )
                          : "Não Informado"
                      }
                      size="small"
                      sx={{ 
                        ml: 1,
                        backgroundColor: contact?.lgpdAcceptedAt ? blue[500] : "#555555",
                        color: "#ffffff"
                      }}
                    />
                  </Typography>
                </Box>

                <FieldArray name="extraInfo">
                  {({ push, remove }) => (
                    <>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{
                          mt: 3,
                          color: "#ffffff",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <AddIcon sx={{ mr: 1, fontSize: "1.2rem", color: "#437db5" }} />
                        {i18n.t("contactModal.form.extraInfo")}
                      </Typography>

                      {values.extraInfo &&
                        values.extraInfo.map((info, index) => (
                          <Stack
                            key={index}
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            mt={2}
                          >
                            <Field
                              as={TextField}
                              label={i18n.t("contactModal.form.extraName")}
                              name={`extraInfo[${index}].name`}
                              fullWidth
                              variant="filled"
                              sx={{
                                "& .MuiFilledInput-root": {
                                  bgcolor: "#2a2a2a",
                                  borderRadius: "8px",
                                  color: "#ffffff",
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#cccccc",
                                },
                              }}
                            />
                            <Field
                              as={TextField}
                              label={i18n.t("contactModal.form.extraValue")}
                              name={`extraInfo[${index}].value`}
                              fullWidth
                              variant="filled"
                              sx={{
                                "& .MuiFilledInput-root": {
                                  bgcolor: "#2a2a2a",
                                  borderRadius: "8px",
                                  color: "#ffffff",
                                },
                                "& .MuiInputLabel-root": {
                                  color: "#cccccc",
                                },
                              }}
                            />
                            <IconButton
                              onClick={() => remove(index)}
                              style={{
                              backgroundColor: "#db6565",
                              borderRadius: "10px",
                              padding: "8px"
                              }}
                            >
                              <DeleteOutlineIcon style={{ color: "#fff" }} />
                            </IconButton>
                          </Stack>
                        ))}

                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push({ name: "", value: "" })}
                        variant="contained"
                        style={{
                        color: "white",
                        backgroundColor: "#437db5",
                        boxShadow: "none",
                        borderRadius: "5px",
                        fontSize: "12px",
                       }}
                      >
                        {i18n.t("contactModal.buttons.addExtraInfo")}
                      </Button>
                    </>
                  )}
                </FieldArray>
              </Box>

              <Divider sx={{ my: 1, backgroundColor: "#555555" }} />

              <DialogActions
                sx={{
                  bgcolor: "#1a1a1a",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  onClick={handleClose}
                  startIcon={<CancelIcon />}
                  variant="contained"
                  style={{
                  color: "white",
                  backgroundColor: "#db6565",
                  boxShadow: "none",
                  borderRadius: "5px",
                  fontSize: "12px",
                  }}
                >
                  {i18n.t("contactModal.buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                  variant="contained"
                  style={{
                  color: "white",
                  backgroundColor: "#437db5",
                  boxShadow: "none",
                  borderRadius: "5px",
                  fontSize: "12px",
                  }}
                >
                  {contactId
                    ? i18n.t("contactModal.buttons.okEdit")
                    : i18n.t("contactModal.buttons.okAdd")}
                  {isSubmitting && (
                    <CircularProgress
                      size={24}
                      sx={{ color: "white", ml: 2 }}
                    />
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;