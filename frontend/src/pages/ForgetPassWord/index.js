import React, { useState } from "react";
import qs from "query-string";
import {
  IconButton, InputAdornment, Button, CssBaseline, TextField, Link, Grid,
  Box, Typography, Container, AppBar, Toolbar
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Facebook as FacebookIcon,
  YouTube as YouTubeIcon,
  Instagram as InstagramIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Email as EmailIcon,
  VpnKey as VpnKeyIcon,
  Lock as LockIcon
} from "@material-ui/icons";
import * as Yup from "yup";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import moment from "moment";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import { Helmet } from "react-helmet";
import wallfundo from "../../assets/f002.png";
import { versionSystem, nomeEmpresa } from "../../../package.json";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  '@import':
    "url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap')",
  root: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#181A20",
  },
  paper: {
    background: "#23252b",
    border: "2px solid #222b3a",
    borderRadius: 18,
    boxShadow: "0 0 0 3px #0a0e17, 0 8px 32px 0 rgba(0,0,0,0.25)",
    padding: "36px 28px 28px 28px",
    maxWidth: 370,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#b0b3c6",
    fontSize: 15,
    fontWeight: 400,
    marginBottom: 18,
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginTop: 0,
  },
  textField: {
    marginBottom: 18,
    '& .MuiOutlinedInput-root': {
      borderRadius: 10,
      background: "#181A20",
      color: "#fff",
      border: "2px solid #353945",
      '& fieldset': {
        borderColor: "#353945",
      },
      '&:hover fieldset': {
        borderColor: "#444198",
      },
      '&.Mui-focused fieldset': {
        borderColor: "#F78C6B",
        borderWidth: 2,
      },
    },
    '& input': {
      color: "#fff",
      fontFamily: "'Poppins', sans-serif",
    },
    '& .MuiInputAdornment-root': {
      color: "#b0b3c6",
    },
  },
  submit: {
    borderRadius: 10,
    background: "#fff",
    color: "#181A20",
    fontWeight: 700,
    fontSize: 16,
    border: "3px solid #F78C6B",
    margin: "10px 0 0 0",
    boxShadow: "0 2px 8px 0 #F78C6B22",
    transition: "all 0.18s",
    '&:hover': {
      background: "#F78C6B",
      color: "#fff",
      borderColor: "#F78C6B",
    },
    '&:disabled': {
      opacity: 0.7,
    },
  },
  backLink: {
    color: "#6a82fb",
    textAlign: "center",
    marginTop: 18,
    fontWeight: 500,
    fontSize: 15,
    textDecoration: "underline",
    cursor: "pointer",
    '&:hover': {
      color: "#F78C6B",
    },
  },
  errorMessage: {
    marginTop: 12,
    color: "#f44336",
    fontWeight: 600,
    letterSpacing: 0.3,
    textAlign: "center"
  },
  copyright: {
    marginTop: 18,
    color: "#b0b3c6",
    fontSize: 13,
    fontFamily: "'Poppins', monospace",
    userSelect: "none",
    textAlign: "center"
  }
}));

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const Copyright = () => (
  <Typography className={useStyles().copyright}>
    © {new Date().getFullYear()} - {nomeEmpresa} - v{versionSystem}
  </Typography>
);

const ForgetPassword = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const history = useHistory();
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [showResetPasswordButton, setShowResetPasswordButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const toggleAdditionalFields = () => {
    setShowAdditionalFields(!showAdditionalFields);
    setShowResetPasswordButton((prev) => !prev);
  };

  const params = qs.parse(window.location.search);
  let companyId = params.companyId !== undefined ? params.companyId : null;
  const initialState = { email: "" };
  const [user] = useState(initialState);

  const handleSendEmail = async (values) => {
    try {
      const response = await api.post(
        `${process.env.REACT_APP_BACKEND_URL}/forgetpassword/${values.email}`
      );
      if (response.data.status === 404) {
        toast.error("Email não encontrado");
      } else {
        toast.success(i18n.t("Email enviado com sucesso!"));
      }
    } catch (err) {
      toastError(err);
    }
  };

  const handleResetPassword = async (values) => {
    if (values.newPassword === values.confirmPassword) {
      try {
        await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/resetpasswords/${values.email}/${values.token}/${values.newPassword}`
        );
        setError("");
        toast.success(i18n.t("Senha redefinida com sucesso."));
        history.push("/login");
      } catch (err) {
        setError("Erro ao redefinir senha.");
      }
    }
  };

  const isResetPasswordButtonClicked = showResetPasswordButton;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Obrigatório"),
    newPassword: isResetPasswordButtonClicked
      ? Yup.string()
          .required("Campo obrigatório")
          .matches(
            passwordRegex,
            "Sua senha precisa ter no mínimo 8 caracteres, sendo uma letra maiúscula, uma minúscula e um número."
          )
      : Yup.string(),
    confirmPassword: Yup.string().when("newPassword", {
      is: (newPassword) => isResetPasswordButtonClicked && newPassword,
      then: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "As senhas não correspondem")
        .required("Campo obrigatório"),
      otherwise: Yup.string(),
    }),
  });

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Redefinir Senha</title>
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {/* Logo removida para visual mais simples */}
          <Typography className={classes.title}>Reset your password</Typography>
          <Typography className={classes.subtitle}>
            Enter the email linked to your account to get a password reset link
          </Typography>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={Yup.object({
              email: Yup.string().email("Invalid email").required("Required")
            })}
            onSubmit={async (values, actions) => {
              await handleSendEmail(values);
              actions.setSubmitting(false);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={classes.form}>
                <Field
                  as={TextField}
                  variant="outlined"
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="Email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  autoComplete="email"
                  required
                  className={classes.textField}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Reset password
                </Button>
                {error && (
                  <Typography className={classes.errorMessage}>
                    {error}
                  </Typography>
                )}
              </Form>
            )}
          </Formik>
          <div
            className={classes.backLink}
            onClick={() => history.push("/login")}
            tabIndex={0}
            role="button"
          >
            Back
          </div>
          <Copyright />
        </div>
        <Box mt={5} />
      </Container>
    </div>
  );
};

export default ForgetPassword;
