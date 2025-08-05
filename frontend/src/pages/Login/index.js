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
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    position: "relative",
    overflow: "hidden",
    '&::before': {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
      zIndex: 0,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(4, 3),
    maxWidth: 420,
    width: "100%",
    borderRadius: 20,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid rgba(148, 163, 184, 0.1)",
    position: "relative",
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 2),
      maxWidth: "95%",
      borderRadius: 16,
    },
  },
  title: {
    fontWeight: 800,
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: theme.spacing(3),
    letterSpacing: 1.2,
    fontFamily: "'Inter', 'Poppins', sans-serif",
    fontSize: 26,
    textAlign: "center",
    [theme.breakpoints.down('sm')]: {
      fontSize: 22,
    },
  },
  subTitle: {
    color: "#94a3b8",
    marginBottom: theme.spacing(3),
    fontWeight: 400,
    fontSize: 15,
    textAlign: "center",
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginBottom: theme.spacing(2),
    },
  },
  form: {
    width: "100%",
    marginTop: 0,
  },
  textField: {
    marginBottom: theme.spacing(2.5),
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      background: "rgba(15, 23, 42, 0.6)",
      backdropFilter: "blur(10px)",
      color: "#f1f5f9",
      transition: "all 0.3s ease",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      '& input': {
        color: "#f1f5f9",
        fontSize: 15,
        fontWeight: 500,
        '&::placeholder': {
          color: "#64748b",
        },
      },
      '& fieldset': {
        borderColor: "rgba(148, 163, 184, 0.2)",
        borderWidth: 1,
      },
      '&:hover': {
        background: "rgba(15, 23, 42, 0.8)",
        transform: "translateY(-1px)",
        '& fieldset': {
          borderColor: "rgba(59, 130, 246, 0.4)",
        },
      },
      '&.Mui-focused': {
        background: "rgba(15, 23, 42, 0.9)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.15)",
        '& fieldset': {
          borderColor: "#3b82f6",
          borderWidth: 2,
        },
      },
    },
    '& .MuiInputAdornment-root': {
      color: "#64748b",
      '& .MuiSvgIcon-root': {
        fontSize: 20,
      },
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: -6,
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: theme.spacing(1),
    },
  },
  rememberLabel: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 500,
    marginLeft: 8,
    userSelect: "none",
  },
  forgot: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    '&:hover': {
      color: "#2563eb",
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
    margin: theme.spacing(2.5, 0, 1.5),
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 16,
    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "#fff",
    textTransform: "none",
    height: 50,
    boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    '&:hover': {
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
      boxShadow: "0 8px 25px rgba(59, 130, 246, 0.6), 0 4px 8px rgba(0, 0, 0, 0.2)",
      transform: "translateY(-2px)",
    },
    '&:active': {
      transform: "translateY(0px)",
    },
    '&:disabled': {
      background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      boxShadow: "none",
      color: "#cbd5e1",
      transform: "none",
    },
    [theme.breakpoints.down('sm')]: {
      height: 48,
      fontSize: 15,
    },
  },
  signupRow: {
    marginTop: 20,
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 15,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
      marginTop: 16,
    },
  },
  signupLink: {
    color: "#3b82f6",
    fontWeight: 700,
    marginLeft: 6,
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    '&:hover': {
      color: "#2563eb",
      textDecoration: "underline",
    },
  },
  errorText: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
    color: "#ef4444",
    fontWeight: 600,
    fontSize: 14,
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
  },
  copyright: {
    marginTop: theme.spacing(3),
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "'Inter', 'Roboto Mono', monospace",
    userSelect: "none",
    [theme.breakpoints.down('sm')]: {
      fontSize: 11,
      marginTop: theme.spacing(2),
    },
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
        <Typography className={classes.title} component="h1" gutterBottom>
          {nomeEmpresa || "CHATPAGEPRO"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} autoComplete="off">
          <TextField
            variant="outlined"
            fullWidth
            id="email"
            name="email"
            placeholder="Digite seu email"
            autoComplete="email"
            autoFocus
            value={user.email}
            onChange={handleChange}
            disabled={loading}
            className={classes.textField}
            InputProps={{
              style: { color: "#f1f5f9" },
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon style={{ color: "#64748b" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            fullWidth
            name="password"
            id="password"
            placeholder="Digite sua senha"
            type="password"
            autoComplete="current-password"
            value={user.password}
            onChange={handleChange}
            disabled={loading}
            className={classes.textField}
            InputProps={{
              style: { color: "#f1f5f9" },
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon style={{ color: "#64748b" }} />
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.rememberRow}>
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer",
              padding: "4px 0"
            }}>
              <input
                type="checkbox"
                name="remember"
                checked={user.remember}
                onChange={handleChange}
                style={{ 
                  accentColor: "#3b82f6", 
                  marginRight: 8,
                  width: 16,
                  height: 16,
                  cursor: "pointer"
                }}
              />
              <span className={classes.rememberLabel}>Lembrar de mim</span>
            </label>
            <Link component={RouterLink} to="/forgetpsw" className={classes.forgot} variant="body2" underline="none">
              Esqueceu a senha?
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
            {loading ? <CircularProgress size={22} color="inherit" /> : "Entrar"}
          </Button>
        </form>
        <div className={classes.signupRow}>
          Não possui uma conta?
          <Link component={RouterLink} to="/signup" className={classes.signupLink} variant="body2" underline="none">
            Cadastre-se
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
