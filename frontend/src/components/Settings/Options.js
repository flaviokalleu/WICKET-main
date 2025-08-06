import React, { useEffect, useState, useContext } from "react";

import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import useSettings from "../../hooks/useSettings";
import { ToastContainer, toast } from 'react-toastify';
import { makeStyles } from "@material-ui/core/styles";
import { grey, blue, green, orange } from "@material-ui/core/colors";

import Divider from "@mui/material/Divider";
import Switch from "@material-ui/core/Switch";
import { Tab, Tabs, TextField } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import useCompanySettings from "../../hooks/useSettings/companySettings";

// Ícones nativos do Material-UI
import ChatIcon from "@material-ui/icons/Chat";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import StarIcon from "@material-ui/icons/Star";
import SendIcon from "@material-ui/icons/Send";
import PeopleIcon from "@material-ui/icons/People";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import CallIcon from "@material-ui/icons/Call";
import SignatureIcon from "@material-ui/icons/Edit";
import QueueIcon from "@material-ui/icons/Queue";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MicIcon from "@material-ui/icons/Mic";
import SecurityIcon from "@material-ui/icons/Security";
import TagIcon from "@material-ui/icons/Label";
import CloseIcon from "@material-ui/icons/Close";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LinkIcon from "@material-ui/icons/Link";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import PhoneIcon from "@material-ui/icons/Phone";
import PaymentIcon from "@material-ui/icons/Payment";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";
import DownloadIcon from "@material-ui/icons/GetApp";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#0a0a0a",
    padding: theme.spacing(3),
    minHeight: '100vh',
    borderRadius: "16px",
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    color: "#437db5",
    marginBottom: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  sectionCard: {
    marginBottom: theme.spacing(3),
    borderRadius: 16,
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
    overflow: "hidden",
    '&:hover': {
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
      transform: 'translateY(-2px)',
      borderColor: "#404040",
    },
  },
  sectionHeader: {
    backgroundColor: "#262626",
    color: '#ffffff',
    padding: theme.spacing(3),
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderBottom: "1px solid #404040",
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    margin: 0,
    color: "#ffffff",
  },
  sectionContent: {
    padding: theme.spacing(3),
    backgroundColor: "#1a1a1a",
  },
  switchCard: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    border: '1px solid #404040',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#2a2a2a',
      borderColor: "#525252",
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    },
  },
  switchContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  switchLabel: {
    fontSize: "0.95rem",
    color: "#ffffff",
    fontWeight: 500,
    flex: 1,
  },
  switchHelperText: {
    fontSize: "0.8rem",
    color: "#b3b3b3",
    marginTop: theme.spacing(0.5),
  },
  customTextField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: "#262626",
      transition: 'all 0.2s ease',
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
  customSelect: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: "#262626",
      "& fieldset": {
        borderColor: "#404040",
      },
      "&:hover fieldset": {
        borderColor: "#525252",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#437db5",
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
    },
    "& .MuiSvgIcon-root": {
      color: "#b3b3b3",
    },
  },
  accordion: {
    marginBottom: theme.spacing(2),
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    '&:before': {
      display: 'none',
    },
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    overflow: "hidden",
  },
  accordionSummary: {
    backgroundColor: "#262626",
    borderRadius: '12px 12px 0 0',
    borderBottom: "1px solid #404040",
    '&.Mui-expanded': {
      minHeight: 48,
    },
    "& .MuiAccordionSummary-content": {
      color: "#ffffff",
    },
    "& .MuiSvgIcon-root": {
      color: "#b3b3b3",
    },
  },
  paymentSection: {
    backgroundColor: '#1a1a1a',
    borderLeft: `4px solid #437db5`,
  },
  lgpdSection: {
    backgroundColor: '#1a1a1a',
    borderLeft: `4px solid ${orange[500]}`,
  },
  statusChip: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  enabledChip: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
  },
  disabledChip: {
    backgroundColor: "#666666",
    color: "#ffffff",
  },
}));

// Componente para Switch customizado
const CustomSwitch = ({ 
  checked, 
  onChange, 
  label, 
  loading, 
  helperText,
  icon: Icon 
}) => {
  const classes = useStyles();
  
  return (
    <div className={classes.switchCard}>
      <div className={classes.switchContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon style={{ color: grey[600] }} />}
          <span className={classes.switchLabel}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`${classes.statusChip} ${checked ? classes.enabledChip : classes.disabledChip}`}>
            {checked ? 'Ativo' : 'Inativo'}
          </div>
          <Switch
            checked={checked}
            onChange={onChange}
            color="primary"
            disabled={loading}
          />
        </div>
      </div>
      {(loading || helperText) && (
        <div className={classes.switchHelperText}>
          {loading ? 'Atualizando...' : helperText}
        </div>
      )}
    </div>
  );
};

// Componente para seção de configurações
const SettingsSection = ({ title, icon: Icon, children, color = "#437db5" }) => {
  const classes = useStyles();
  
  return (
    <Card className={classes.sectionCard}>
      <div className={classes.sectionHeader} style={{ backgroundColor: color }}>
        {Icon && <Icon style={{ color: "#ffffff" }} />}
        <Typography className={classes.sectionTitle}>{title}</Typography>
      </div>
      <CardContent className={classes.sectionContent}>
        {children}
      </CardContent>
    </Card>
  );
};

export default function Options(props) {
  const { oldSettings, settings, scheduleTypeChanged, user } = props;
  const classes = useStyles();

  // Estados (mantendo os mesmos do código original)
  const [userRating, setUserRating] = useState("disabled");
  const [scheduleType, setScheduleType] = useState("disabled");
  const [chatBotType, setChatBotType] = useState("text");
  const [loadingUserRating, setLoadingUserRating] = useState(false);
  const [loadingScheduleType, setLoadingScheduleType] = useState(false);
  const [userCreation, setUserCreation] = useState("disabled");
  const [loadingUserCreation, setLoadingUserCreation] = useState(false);
  const [SendGreetingAccepted, setSendGreetingAccepted] = useState("enabled");
  const [loadingSendGreetingAccepted, setLoadingSendGreetingAccepted] = useState(false);
  const [UserRandom, setUserRandom] = useState("enabled");
  const [loadingUserRandom, setLoadingUserRandom] = useState(false);
  const [SettingsTransfTicket, setSettingsTransfTicket] = useState("enabled");
  const [loadingSettingsTransfTicket, setLoadingSettingsTransfTicket] = useState(false);
  const [AcceptCallWhatsapp, setAcceptCallWhatsapp] = useState("enabled");
  const [loadingAcceptCallWhatsapp, setLoadingAcceptCallWhatsapp] = useState(false);
  const [sendSignMessage, setSendSignMessage] = useState("enabled");
  const [loadingSendSignMessage, setLoadingSendSignMessage] = useState(false);
  const [sendGreetingMessageOneQueues, setSendGreetingMessageOneQueues] = useState("enabled");
  const [loadingSendGreetingMessageOneQueues, setLoadingSendGreetingMessageOneQueues] = useState(false);
  const [sendQueuePosition, setSendQueuePosition] = useState("enabled");
  const [loadingSendQueuePosition, setLoadingSendQueuePosition] = useState(false);
  const [sendFarewellWaitingTicket, setSendFarewellWaitingTicket] = useState("enabled");
  const [loadingSendFarewellWaitingTicket, setLoadingSendFarewellWaitingTicket] = useState(false);
  const [acceptAudioMessageContact, setAcceptAudioMessageContact] = useState("enabled");
  const [loadingAcceptAudioMessageContact, setLoadingAcceptAudioMessageContact] = useState(false);

  // Estados para pagamentos e outras configurações (mantendo os mesmos)
  const [eficlientidType, setEfiClientidType] = useState('');
  const [loadingEfiClientidType, setLoadingEfiClientidType] = useState(false);
  const [eficlientsecretType, setEfiClientsecretType] = useState('');
  const [loadingEfiClientsecretType, setLoadingEfiClientsecretType] = useState(false);
  const [efichavepixType, setEfiChavepixType] = useState('');
  const [loadingEfiChavepixType, setLoadingEfiChavepixType] = useState(false);
  const [mpaccesstokenType, setmpaccesstokenType] = useState('');
  const [loadingmpaccesstokenType, setLoadingmpaccesstokenType] = useState(false);
  const [stripeprivatekeyType, setstripeprivatekeyType] = useState('');
  const [loadingstripeprivatekeyType, setLoadingstripeprivatekeyType] = useState(false);
  const [asaastokenType, setasaastokenType] = useState('');
  const [loadingasaastokenType, setLoadingasaastokenType] = useState(false);
  const [openaitokenType, setopenaitokenType] = useState('');
  const [loadingopenaitokenType, setLoadingopenaitokenType] = useState(false);

  // Estados LGPD
  const [enableLGPD, setEnableLGPD] = useState("disabled");
  const [loadingEnableLGPD, setLoadingEnableLGPD] = useState(false);
  const [lgpdMessage, setLGPDMessage] = useState("");
  const [loadinglgpdMessage, setLoadingLGPDMessage] = useState(false);
  const [lgpdLink, setLGPDLink] = useState("");
  const [loadingLGPDLink, setLoadingLGPDLink] = useState(false);
  const [lgpdDeleteMessage, setLGPDDeleteMessage] = useState("disabled");
  const [loadingLGPDDeleteMessage, setLoadingLGPDDeleteMessage] = useState(false);
  const [downloadLimit, setdownloadLimit] = useState("64");
  const [loadingDownloadLimit, setLoadingdownloadLimit] = useState(false);
  const [lgpdConsent, setLGPDConsent] = useState("disabled");
  const [loadingLGPDConsent, setLoadingLGPDConsent] = useState(false);
  const [lgpdHideNumber, setLGPDHideNumber] = useState("disabled");
  const [loadingLGPDHideNumber, setLoadingLGPDHideNumber] = useState(false);
  const [requiredTag, setRequiredTag] = useState("enabled");
  const [loadingRequiredTag, setLoadingRequiredTag] = useState(false);
  const [closeTicketOnTransfer, setCloseTicketOnTransfer] = useState(false);
  const [loadingCloseTicketOnTransfer, setLoadingCloseTicketOnTransfer] = useState(false);
  const [directTicketsToWallets, setDirectTicketsToWallets] = useState(false);
  const [loadingDirectTicketsToWallets, setLoadingDirectTicketsToWallets] = useState(false);

  // Estados para mensagens customizadas
  const [transferMessage, setTransferMessage] = useState("");
  const [loadingTransferMessage, setLoadingTransferMessage] = useState(false);
  const [greetingAcceptedMessage, setGreetingAcceptedMessage] = useState("");
  const [loadingGreetingAcceptedMessage, setLoadingGreetingAcceptedMessage] = useState(false);
  const [AcceptCallWhatsappMessage, setAcceptCallWhatsappMessage] = useState("");
  const [loadingAcceptCallWhatsappMessage, setLoadingAcceptCallWhatsappMessage] = useState(false);
  const [sendQueuePositionMessage, setSendQueuePositionMessage] = useState("");
  const [loadingSendQueuePositionMessage, setLoadingSendQueuePositionMessage] = useState(false);
  const [showNotificationPending, setShowNotificationPending] = useState(false);
  const [loadingShowNotificationPending, setLoadingShowNotificationPending] = useState(false);
  const [notificameHubToken, setNotificameHubToken] = useState("");
  const [loadingNotificameHubToken, setLoadingNotificameHubToken] = useState(false);

  // Hooks (mantendo os mesmos do código original)
  const { update: updateUserCreation, getAll } = useSettings();
  const { update: updatedownloadLimit } = useSettings();
  const { update: updateeficlientid } = useSettings();
  const { update: updateeficlientsecret } = useSettings();
  const { update: updateefichavepix } = useSettings();
  const { update: updatempaccesstoken } = useSettings();
  const { update: updatestripeprivatekey } = useSettings();
  const { update: updateasaastoken } = useSettings();
  const { update: updateopenaitoken } = useSettings();
  const { update } = useCompanySettings();

  const isSuper = () => {
    return user.super;
  };

  // UseEffects (mantendo os mesmos do código original)
  useEffect(() => {
    if (Array.isArray(oldSettings) && oldSettings.length) {
      const userPar = oldSettings.find((s) => s.key === "userCreation");
      if (userPar) setUserCreation(userPar.value);

      const downloadLimit = oldSettings.find((s) => s.key === "downloadLimit");
      if (downloadLimit) setdownloadLimit(downloadLimit.value);

      const eficlientidType = oldSettings.find((s) => s.key === 'eficlientid');
      if (eficlientidType) setEfiClientidType(eficlientidType.value);

      const eficlientsecretType = oldSettings.find((s) => s.key === 'eficlientsecret');
      if (eficlientsecretType) setEfiClientsecretType(eficlientsecretType.value);

      const efichavepixType = oldSettings.find((s) => s.key === 'efichavepix');
      if (efichavepixType) setEfiChavepixType(efichavepixType.value);

      const mpaccesstokenType = oldSettings.find((s) => s.key === 'mpaccesstoken');
      if (mpaccesstokenType) setmpaccesstokenType(mpaccesstokenType.value);

      const asaastokenType = oldSettings.find((s) => s.key === 'asaastoken');
      if (asaastokenType) setasaastokenType(asaastokenType.value);

      const openaitokenType = oldSettings.find((s) => s.key === 'openaikeyaudio');
      if (openaitokenType) setopenaitokenType(openaitokenType.value);
    }
  }, [oldSettings]);

  useEffect(() => {
    for (const [key, value] of Object.entries(settings)) {
      if (key === "userRating") setUserRating(value);
      if (key === "scheduleType") setScheduleType(value);
      if (key === "chatBotType") setChatBotType(value);
      if (key === "acceptCallWhatsapp") setAcceptCallWhatsapp(value);
      if (key === "userRandom") setUserRandom(value);
      if (key === "sendGreetingMessageOneQueues") setSendGreetingMessageOneQueues(value);
      if (key === "sendSignMessage") setSendSignMessage(value);
      if (key === "sendFarewellWaitingTicket") setSendFarewellWaitingTicket(value);
      if (key === "sendGreetingAccepted") setSendGreetingAccepted(value);
      if (key === "sendQueuePosition") setSendQueuePosition(value);
      if (key === "acceptAudioMessageContact") setAcceptAudioMessageContact(value);
      if (key === "enableLGPD") setEnableLGPD(value);
      if (key === "requiredTag") setRequiredTag(value);
      if (key === "lgpdDeleteMessage") setLGPDDeleteMessage(value);
      if (key === "lgpdHideNumber") setLGPDHideNumber(value);
      if (key === "lgpdConsent") setLGPDConsent(value);
      if (key === "lgpdMessage") setLGPDMessage(value);
      if (key === "sendMsgTransfTicket") setSettingsTransfTicket(value);
      if (key === "lgpdLink") setLGPDLink(value);
      if (key === "DirectTicketsToWallets") setDirectTicketsToWallets(value);
      if (key === "closeTicketOnTransfer") setCloseTicketOnTransfer(value);
      if (key === "transferMessage") setTransferMessage(value);
      if (key === "greetingAcceptedMessage") setGreetingAcceptedMessage(value);
      if (key === "AcceptCallWhatsappMessage") setAcceptCallWhatsappMessage(value);
      if (key === "sendQueuePositionMessage") setSendQueuePositionMessage(value);
      if (key === "showNotificationPending") setShowNotificationPending(value);
      if (key === "notificameHub") setNotificameHubToken(value);
    }
  }, [settings]);

  // Funções de atualização (mantendo as mesmas do código original mas apenas algumas como exemplo)
  async function handleChangeUserCreation(value) {
    setUserCreation(value);
    setLoadingUserCreation(true);
    await updateUserCreation({ key: "userCreation", value });
    setLoadingUserCreation(false);
  }

  async function handleDownloadLimit(value) {
    setdownloadLimit(value);
    setLoadingdownloadLimit(true);
    await updatedownloadLimit({ key: "downloadLimit", value });
    setLoadingdownloadLimit(false);
  }

  async function handleChangeUserRating(value) {
    setUserRating(value);
    setLoadingUserRating(true);
    await update({ column: "userRating", data: value });
    setLoadingUserRating(false);
  }

  async function handleScheduleType(value) {
    setScheduleType(value);
    setLoadingScheduleType(true);
    await update({ column: "scheduleType", data: value });
    setLoadingScheduleType(false);
    if (typeof scheduleTypeChanged === "function") {
      scheduleTypeChanged(value);
    }
  }

  async function handleChatBotType(value) {
    setChatBotType(value);
    await update({ column: "chatBotType", data: value });
    if (typeof scheduleTypeChanged === "function") {
      setChatBotType(value);
    }
  }

  async function handleSendGreetingAccepted(value) {
    setSendGreetingAccepted(value);
    setLoadingSendGreetingAccepted(true);
    await update({ column: "sendGreetingAccepted", data: value });
    setLoadingSendGreetingAccepted(false);
  }

  async function handleUserRandom(value) {
    setUserRandom(value);
    setLoadingUserRandom(true);
    await update({ column: "userRandom", data: value });
    setLoadingUserRandom(false);
  }

  async function handleSettingsTransfTicket(value) {
    setSettingsTransfTicket(value);
    setLoadingSettingsTransfTicket(true);
    await update({ column: "sendMsgTransfTicket", data: value });
    setLoadingSettingsTransfTicket(false);
  }

  async function handleAcceptCallWhatsapp(value) {
    setAcceptCallWhatsapp(value);
    setLoadingAcceptCallWhatsapp(true);
    await update({ column: "acceptCallWhatsapp", data: value });
    setLoadingAcceptCallWhatsapp(false);
  }

  async function handleSendSignMessage(value) {
    setSendSignMessage(value);
    setLoadingSendSignMessage(true);
    await update({ column: "sendSignMessage", data: value });
    localStorage.setItem("sendSignMessage", value === "enabled" ? true : false);
    setLoadingSendSignMessage(false);
  }

  // Adicionando mais funções conforme necessário...
  async function handleEnableLGPD(value) {
    setEnableLGPD(value);
    setLoadingEnableLGPD(true);
    await update({ column: "enableLGPD", data: value });
    setLoadingEnableLGPD(false);
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.pageTitle}>
        <SettingsIcon />
        Configurações do Sistema
      </Typography>

      {/* Configurações Básicas */}
      <SettingsSection title="Configurações Básicas" icon={SettingsIcon}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth className={classes.customSelect}>
              <InputLabel>Tipo do Bot</InputLabel>
              <Select
                value={chatBotType}
                onChange={(e) => handleChatBotType(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <ChatIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                }
              >
                <MenuItem value={"text"}>Texto</MenuItem>
                <MenuItem value={"list"}>Lista</MenuItem>
                <MenuItem value={"button"}>Botões</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth className={classes.customSelect}>
              <InputLabel>Agendamento de Expediente</InputLabel>
              <Select
                value={scheduleType}
                onChange={(e) => handleScheduleType(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <ScheduleIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                }
              >
                <MenuItem value={"disabled"}>Desabilitado</MenuItem>
                <MenuItem value={"queue"}>Gerenciamento de Fila</MenuItem>
                <MenuItem value={"company"}>Gerenciamento de Empresa</MenuItem>
                <MenuItem value={"connection"}>Gerenciamento de Conexão</MenuItem>
              </Select>
              <FormHelperText>{loadingScheduleType && "Atualizando..."}</FormHelperText>
            </FormControl>
          </Grid>

          {isSuper() && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className={classes.customSelect}>
                <InputLabel>Limite de Download (MB)</InputLabel>
                <Select
                  value={downloadLimit}
                  onChange={(e) => handleDownloadLimit(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <DownloadIcon style={{ color: grey[500] }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value={"32"}>32 MB</MenuItem>
                  <MenuItem value={"64"}>64 MB</MenuItem>
                  <MenuItem value={"128"}>128 MB</MenuItem>
                  <MenuItem value={"256"}>256 MB</MenuItem>
                  <MenuItem value={"512"}>512 MB</MenuItem>
                  <MenuItem value={"1024"}>1024 MB</MenuItem>
                  <MenuItem value={"2048"}>2048 MB</MenuItem>
                </Select>
                <FormHelperText>{loadingDownloadLimit && "Atualizando..."}</FormHelperText>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </SettingsSection>

      {/* Configurações de Atendimento */}
      <SettingsSection title="Configurações de Atendimento" icon={PeopleIcon}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CustomSwitch
              checked={userRating === "enabled"}
              onChange={(e) => handleChangeUserRating(e.target.checked ? "enabled" : "disabled")}
              label="Avaliações de Atendimento"
              loading={loadingUserRating}
              icon={StarIcon}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSwitch
              checked={SendGreetingAccepted === "enabled"}
              onChange={(e) => handleSendGreetingAccepted(e.target.checked ? "enabled" : "disabled")}
              label="Enviar Saudação ao Aceitar Ticket"
              loading={loadingSendGreetingAccepted}
              icon={SendIcon}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSwitch
              checked={UserRandom === "enabled"}
              onChange={(e) => handleUserRandom(e.target.checked ? "enabled" : "disabled")}
              label="Escolher Operador Aleatório"
              loading={loadingUserRandom}
              icon={PeopleIcon}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSwitch
              checked={SettingsTransfTicket === "enabled"}
              onChange={(e) => handleSettingsTransfTicket(e.target.checked ? "enabled" : "disabled")}
              label="Mensagem de Transferência"
              loading={loadingSettingsTransfTicket}
              icon={TransferWithinAStationIcon}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSwitch
              checked={AcceptCallWhatsapp === "enabled"}
              onChange={(e) => handleAcceptCallWhatsapp(e.target.checked ? "enabled" : "disabled")}
              label="Aviso sobre Ligação WhatsApp"
              loading={loadingAcceptCallWhatsapp}
              icon={CallIcon}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomSwitch
              checked={sendSignMessage === "enabled"}
              onChange={(e) => handleSendSignMessage(e.target.checked ? "enabled" : "disabled")}
              label="Habilitar Retirada de Assinatura"
              loading={loadingSendSignMessage}
              icon={SignatureIcon}
            />
          </Grid>

          {isSuper() && (
            <Grid item xs={12} md={6}>
              <CustomSwitch
                checked={userCreation === "enabled"}
                onChange={(e) => handleChangeUserCreation(e.target.checked ? "enabled" : "disabled")}
                label="Criação de Empresa/Usuários"
                loading={loadingUserCreation}
                icon={PersonAddIcon}
              />
            </Grid>
          )}
        </Grid>
      </SettingsSection>

      {/* LGPD */}
      <SettingsSection title="LGPD - Lei Geral de Proteção de Dados" icon={SecurityIcon} color={orange[600]}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomSwitch
              checked={enableLGPD === "enabled"}
              onChange={(e) => handleEnableLGPD(e.target.checked ? "enabled" : "disabled")}
              label="Habilitar LGPD"
              loading={loadingEnableLGPD}
              icon={SecurityIcon}
            />
          </Grid>

          {enableLGPD === "enabled" && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mensagem de Boas-vindas LGPD"
                  variant="outlined"
                  value={lgpdMessage}
                  onChange={(e) => setLGPDMessage(e.target.value)}
                  className={classes.customTextField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChatIcon style={{ color: grey[500] }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Link da Política de Privacidade"
                  variant="outlined"
                  value={lgpdLink}
                  onChange={(e) => setLGPDLink(e.target.value)}
                  className={classes.customTextField}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon style={{ color: grey[500] }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth className={classes.customSelect}>
                  <InputLabel>Ofuscar Mensagens Deletadas</InputLabel>
                  <Select
                    value={lgpdDeleteMessage}
                    onChange={(e) => setLGPDDeleteMessage(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <DeleteIcon style={{ color: grey[500] }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={"disabled"}>Desabilitado</MenuItem>
                    <MenuItem value={"enabled"}>Habilitado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth className={classes.customSelect}>
                  <InputLabel>Sempre Solicitar Consentimento</InputLabel>
                  <Select
                    value={lgpdConsent}
                    onChange={(e) => setLGPDConsent(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <CheckCircleIcon style={{ color: grey[500] }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={"disabled"}>Desabilitado</MenuItem>
                    <MenuItem value={"enabled"}>Habilitado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth className={classes.customSelect}>
                  <InputLabel>Ofuscar Número para Usuários</InputLabel>
                  <Select
                    value={lgpdHideNumber}
                    onChange={(e) => setLGPDHideNumber(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <PhoneIcon style={{ color: grey[500] }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={"disabled"}>Desabilitado</MenuItem>
                    <MenuItem value={"enabled"}>Habilitado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </SettingsSection>

      {/* Configurações de Pagamento */}
      {isSuper() && (
        <>
          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PaymentIcon color="primary" />
                <Typography variant="h6">Configurações de Pagamento - PIX Efí (GerenciaNet)</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Client ID"
                    variant="outlined"
                    value={eficlientidType}
                    onChange={(e) => setEfiClientidType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Client Secret"
                    variant="outlined"
                    type="password"
                    value={eficlientsecretType}
                    onChange={(e) => setEfiClientsecretType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Chave PIX"
                    variant="outlined"
                    value={efichavepixType}
                    onChange={(e) => setEfiChavepixType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaymentIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PaymentIcon color="primary" />
                <Typography variant="h6">Mercado Pago</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Access Token"
                    variant="outlined"
                    type="password"
                    value={mpaccesstokenType}
                    onChange={(e) => setmpaccesstokenType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PaymentIcon color="primary" />
                <Typography variant="h6">Stripe</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Stripe Private Key"
                    variant="outlined"
                    type="password"
                    value={stripeprivatekeyType}
                    onChange={(e) => setstripeprivatekeyType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PaymentIcon color="primary" />
                <Typography variant="h6">ASAAS</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Token ASAAS"
                    variant="outlined"
                    type="password"
                    value={asaastokenType}
                    onChange={(e) => setasaastokenType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion className={classes.accordion}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              className={classes.accordionSummary}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <MicIcon color="primary" />
                <Typography variant="h6">OpenAI - Transcrição de Áudio</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="OpenAI API Key"
                    variant="outlined"
                    type="password"
                    value={openaitokenType}
                    onChange={(e) => setopenaitokenType(e.target.value)}
                    className={classes.customTextField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon style={{ color: grey[500] }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </>
      )}

      {/* Mensagens Customizadas */}
      <SettingsSection title="Mensagens Customizadas" icon={ChatIcon} color={blue[600]}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mensagem de Transferência"
              variant="outlined"
              value={transferMessage}
              onChange={(e) => setTransferMessage(e.target.value)}
              className={classes.customTextField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TransferWithinAStationIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mensagem de Saudação Aceita"
              variant="outlined"
              value={greetingAcceptedMessage}
              onChange={(e) => setGreetingAcceptedMessage(e.target.value)}
              className={classes.customTextField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SendIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mensagem de Ligação WhatsApp"
              variant="outlined"
              value={AcceptCallWhatsappMessage}
              onChange={(e) => setAcceptCallWhatsappMessage(e.target.value)}
              className={classes.customTextField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CallIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mensagem de Posição na Fila"
              variant="outlined"
              value={sendQueuePositionMessage}
              onChange={(e) => setSendQueuePositionMessage(e.target.value)}
              className={classes.customTextField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <QueueIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </SettingsSection>

      {/* Configurações de Notificação */}
      <SettingsSection title="Configurações do NOTIFICAMEHUB" icon={NotificationsIcon} color={green[600]}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Token NotificameHub"
              variant="outlined"
              value={notificameHubToken}
              onChange={(e) => setNotificameHubToken(e.target.value)}
              className={classes.customTextField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotificationsIcon style={{ color: grey[500] }} />
                  </InputAdornment>
                ),
              }}
            />
            <FormHelperText>
              {loadingNotificameHubToken && "Atualizando..."}
            </FormHelperText>
          </Grid>
        </Grid>
      </SettingsSection>

      <ToastContainer />
    </div>
  );
}