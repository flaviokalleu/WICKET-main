import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
  Link,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Helmet } from "react-helmet";
import { versionSystem, nomeEmpresa } from "../../../package.json";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    background: "#232533",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(5, 4),
    maxWidth: 400,
    width: "100%",
    borderRadius: 14,
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    background: "#232533",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1.5px solid #35384a",
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: theme.spacing(2),
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 2px 8px #0002",
    border: "2px solid #35384a",
    background: "#fff",
  },
  title: {
    fontWeight: 700,
    color: "#fff",
    marginBottom: theme.spacing(1),
    letterSpacing: 1.1,
    fontFamily: "'Poppins', sans-serif",
    fontSize: 22,
    textAlign: "center",
  },
  subTitle: {
    color: "#b0b3c6",
    marginBottom: theme.spacing(3),
    fontWeight: 400,
    fontSize: 15,
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginTop: 0,
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      background: "#181a20",
      color: "#fff",
      '& input': {
        color: "#fff",
      },
      '& fieldset': {
        borderColor: "#35384a",
      },
      '&:hover fieldset': {
        borderColor: "#3a7cff",
      },
      '&.Mui-focused fieldset': {
        borderColor: "#3a7cff",
        borderWidth: 2,
      },
    },
    '& .MuiInputAdornment-root': {
      color: "#b0b3c6",
    },
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: -8,
  },
  rememberLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 400,
    marginLeft: 4,
    userSelect: "none",
  },
  forgot: {
    color: "#3a7cff",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "none",
    cursor: "pointer",
    '&:hover': {
      textDecoration: "underline",
    },
  },
  recaptcha: {
    background: "#fff",
    borderRadius: 6,
    border: "1.5px solid #e0e0e0",
    height: 64,
    margin: "18px 0 10px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    fontWeight: 500,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 16,
    background: "#1877f2",
    color: "#fff",
    textTransform: "none",
    boxShadow: "0 2px 8px #1877f233",
    transition: "all 0.2s",
    '&:hover': {
      background: "#145dc2",
      boxShadow: "0 4px 16px #1877f244",
      transform: "translateY(-2px)",
    },
    '&:disabled': {
      background: "#aaa",
      boxShadow: "none",
      color: "#eee"
    }
  },
  signupRow: {
    marginTop: 18,
    textAlign: "center",
    color: "#b0b3c6",
    fontSize: 15,
  },
  signupLink: {
    color: "#3a7cff",
    fontWeight: 600,
    marginLeft: 4,
    textDecoration: "none",
    cursor: "pointer",
    '&:hover': {
      textDecoration: "underline",
    },
  },
  errorText: {
    marginTop: 8,
    textAlign: "center",
    color: "#ff4d4f",
    fontWeight: 600,
    fontSize: 14,
  },
  copyright: {
    marginTop: theme.spacing(3),
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "'Roboto Mono', monospace",
    userSelect: "none",
  },
}));

const Login = () => {
  const classes = useStyles();
  const { handleLogin } = useContext(AuthContext);
  const [user, setUser] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await handleLogin(user);
    } catch (err) {
      setError(i18n.t("login.errors.invalidCredentials") || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Login | {nomeEmpresa || "CHATPAGEPRO"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <Paper className={classes.paper} elevation={3}>
        <img
          src={require("../../assets/logo.png")}
          alt="Logo"
          className={classes.logo}
        />
        <Typography className={classes.title} component="h1" gutterBottom>
          {nomeEmpresa || "CHATPAGEPRO"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} autoComplete="off">
          <TextField
            variant="outlined"
            fullWidth
            id="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            autoFocus
            value={user.email}
            onChange={handleChange}
            disabled={loading}
            className={classes.textField}
            InputProps={{
              style: { color: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            name="password"
            id="password"
            placeholder="Enter your password"
            type="password"
            autoComplete="current-password"
            value={user.password}
            onChange={handleChange}
            disabled={loading}
            className={classes.textField}
            InputProps={{
              style: { color: "#fff" },
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.rememberRow}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="remember"
                checked={user.remember}
                onChange={handleChange}
                style={{ accentColor: "#3a7cff", marginRight: 6 }}
              />
              <span className={classes.rememberLabel}>Remember me</span>
            </label>
            <Link component={RouterLink} to="/forgetpsw" className={classes.forgot} variant="body2" underline="none">
              Forgot password?
            </Link>
          </div>
          {/* reCAPTCHA visual removido para deixar o formulário mais limpo */}
          {error && (
            <Typography className={classes.errorText} variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
            disabled={loading}
            disableElevation
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Sign in"}
          </Button>
        </form>
        <div className={classes.signupRow}>
          Don't have an account ?
          <Link component={RouterLink} to="/signup" className={classes.signupLink} variant="body2" underline="none">
            Sign Up
          </Link>
        </div>
        <div className={classes.copyright}>
          © {new Date().getFullYear()} {nomeEmpresa} - v{versionSystem}
        </div>
      </Paper>
    </div>
  );
};

export default Login;
