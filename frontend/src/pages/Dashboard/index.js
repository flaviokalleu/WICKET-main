import React, { useContext, useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, LinearProgress } from "@mui/material";
import { Groups, SaveAlt } from "@mui/icons-material";
import CallIcon from "@material-ui/icons/Call";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/Message';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';
import * as XLSX from 'xlsx';
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";
import TabPanel from "../../components/TabPanel";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";
import { AuthContext } from "../../context/Auth/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Grid from '@mui/material/Grid';
import useDashboard from "../../hooks/useDashboard";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import ChatsUser from "./ChartsUser";
import ChartDonut from "./ChartDonut";
import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import { Avatar, Button, Card, CardContent, Container, Stack, SvgIcon, Tab, Tabs } from "@mui/material";
import { i18n } from "../../translate/i18n";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ForbiddenPage from "../../components/ForbiddenPage";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    width: "100%",
    margin: 0,
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
    minHeight: "100vh",
  },
  welcomeSection: {
    background: "linear-gradient(135deg, #00d4aa 0%, #00b894 100%)",
    borderRadius: 20,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(3),
    color: "#ffffff",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      width: "200px",
      height: "200px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "50%",
      transform: "translate(50%, -50%)",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "150px",
      height: "150px",
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "50%",
      transform: "translate(-30%, 30%)",
    },
  },
  card: {
    background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
    border: "1px solid #333333",
    borderRadius: 16,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px rgba(0, 212, 170, 0.15)",
      border: "1px solid #00d4aa",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, #00d4aa, #00b894)",
    },
  },
  cardContent: {
    padding: theme.spacing(3),
    color: "#ffffff",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
    background: "linear-gradient(145deg, #00d4aa, #00b894)",
    boxShadow: "0 8px 24px rgba(0, 212, 170, 0.3)",
  },
  cardTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#a0a0a0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: theme.spacing(1),
  },
  cardValue: {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#ffffff",
    lineHeight: 1,
  },
  chartCard: {
    background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
    border: "1px solid #333333",
    borderRadius: 20,
    padding: theme.spacing(3),
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      border: "1px solid #00d4aa",
      boxShadow: "0 12px 32px rgba(0, 212, 170, 0.1)",
    },
  },
  chartTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#ffffff",
    marginBottom: theme.spacing(3),
    textAlign: "center",
  },
  filterButton: {
    background: "linear-gradient(145deg, #00d4aa, #00b894)",
    color: "#ffffff",
    borderRadius: 12,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    border: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(145deg, #00b894, #009688)",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(0, 212, 170, 0.3)",
    },
  },
  dialogPaper: {
    background: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: 16,
  },
  dialogTitle: {
    background: "linear-gradient(145deg, #00d4aa, #00b894)",
    color: "#ffffff",
    padding: theme.spacing(3),
    borderRadius: "16px 16px 0 0",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  dialogContent: {
    padding: theme.spacing(3),
    background: "#1a1a1a",
    color: "#ffffff",
  },
  dialogActions: {
    padding: theme.spacing(2, 3),
    background: "#1a1a1a",
    borderRadius: "0 0 16px 16px",
  },
  performanceCard: {
    background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
    border: "1px solid #333333",
    borderRadius: 20,
    padding: theme.spacing(4),
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, #00d4aa, #00b894)",
    },
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  chartContainer: {
    background: "#1a1a1a",
    borderRadius: 12,
    padding: theme.spacing(2),
    minHeight: "350px",
  },
}));

const ModernCard = ({ title, value, icon, gradient, description }) => {
  const classes = useStyles();
  
  return (
    <Box className={classes.card}>
      <Box className={classes.cardContent}>
        <Box className={classes.cardIcon} sx={{ background: gradient }}>
          {icon}
        </Box>
        <Typography className={classes.cardTitle}>
          {title}
        </Typography>
        <Typography className={classes.cardValue}>
          {value}
        </Typography>
        {description && (
          <Typography sx={{ fontSize: "0.875rem", color: "#666", mt: 1 }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const PerformanceCard = ({ title, value, max, color }) => {
  const classes = useStyles();
  const percentage = (value / max) * 100;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" sx={{ color: "#a0a0a0", fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 600 }}>
          {percentage.toFixed(1)}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 12,
          borderRadius: 6,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          "& .MuiLinearProgress-bar": {
            borderRadius: 6,
            background: `linear-gradient(90deg, ${color} 0%, ${color}99 100%)`,
          },
        }}
      />
    </Box>
  );
};

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([
    {
      status: "Em Atendimento",
      quantidade: 0,
    },
    {
      status: "Aguardando",
      quantidade: 0,
    },
    {
      status: "Finalizados",
      quantidade: 0,
    },
  ]);

  const theme = useTheme();
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [filterType, setFilterType] = useState(1);
  const [period, setPeriod] = useState(0);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  const [tab, setTab] = useState("Indicadores");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedQueues, setSelectedQueues] = useState([]);

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let nowIni = `${year}-${month < 10 ? `0${month}` : `${month}`}-01`;
  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;

  const [showFilter, setShowFilter] = useState(false);
  const [dateStartTicket, setDateStartTicket] = useState(nowIni);
  const [dateEndTicket, setDateEndTicket] = useState(now);
  const [queueTicket, setQueueTicket] = useState(false);
  const [fetchDataFilter, setFetchDataFilter] = useState(false);

  const { user } = useContext(AuthContext);

  const exportarGridParaExcel = () => {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('grid-attendants'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RelatorioDeAtendentes');
    XLSX.writeFile(wb, 'relatorio-de-atendentes.xlsx');
  };

  var userQueueIds = [];

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataFilter]);

  useEffect(() => {
    if (
      counters.supportHappening !== undefined &&
      counters.supportPending !== undefined &&
      counters.supportFinished !== undefined
    ) {
      setBarChartData([
        {
          status: "Em Atendimento",
          quantidade: counters.supportHappening,
        },
        {
          status: "Aguardando",
          quantidade: counters.supportPending,
        },
        {
          status: "Finalizados",
          quantidade: counters.supportFinished,
        },
      ]);
    }
  }, [counters]);

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateStartTicket) && moment(dateStartTicket).isValid()) {
      params = {
        ...params,
        date_from: moment(dateStartTicket).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateEndTicket) && moment(dateEndTicket).isValid()) {
      params = {
        ...params,
        date_to: moment(dateEndTicket).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);
    setSelectedUsers(users);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[h] mm[m]");
  }

  const GetUsers = () => {
    let count;
    let userOnline = 0;
    attendants.forEach(user => {
      if (user.online === true) {
        userOnline = userOnline + 1
      }
    });
    count = userOnline === 0 ? 0 : userOnline;
    return count;
  };

  const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    } else {
      props = {
        dateStart: dateStartTicket,
        dateEnd: dateEndTicket,
      };
    }
    const { count } = useContacts(props);
    return count;
  };

  const GetMessages = (all, fromMe) => {
    let props = {};
    if (all) {
      if (fromMe) {
        props = {
          fromMe: true
        };
      } else {
        props = {
          fromMe: false
        };
      }
    } else {
      if (fromMe) {
        props = {
          fromMe: true,
          dateStart: dateStartTicket,
          dateEnd: dateEndTicket,
        };
      } else {
        props = {
          fromMe: false,
          dateStart: dateStartTicket,
          dateEnd: dateEndTicket,
        };
      }
    }
    const { count } = useMessages(props);
    return count;
  };

  function toggleShowFilter() {
    setShowFilter(!showFilter);
  }

  return (
    <>
      {
        user.profile === "user" && user.showDashboard === "disabled" ?
          <ForbiddenPage />
          :
          <>
            <Box className={classes.container}>
              {/* Seção de Boas-vindas */}
              <Box className={classes.welcomeSection}>
                <Grid2 container alignItems="center" spacing={3}>
                  <Grid2 xs={12} md={8}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, position: "relative", zIndex: 1 }}>
                      Bem-vindo de volta! 👋
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, position: "relative", zIndex: 1 }}>
                      Aqui está um resumo da sua atividade hoje
                    </Typography>
                  </Grid2>
                  <Grid2 xs={12} md={4} sx={{ textAlign: "right" }}>
                    <Button
                      className={classes.filterButton}
                      onClick={toggleShowFilter}
                      startIcon={!showFilter ? <FilterListIcon /> : <ClearIcon />}
                    >
                      {!showFilter ? "Filtros" : "Fechar"}
                    </Button>
                  </Grid2>
                </Grid2>
              </Box>

              {/* Cards de Estatísticas */}
              <Box className={classes.statsGrid}>
                <ModernCard
                  title="Em Atendimento"
                  value={counters.supportHappening || 0}
                  icon={<CallIcon sx={{ color: "#ffffff", fontSize: 28 }} />}
                  gradient="linear-gradient(145deg, #4facfe, #00f2fe)"
                  description="Conversas ativas no momento"
                />
                
                <ModernCard
                  title="Aguardando"
                  value={counters.supportPending || 0}
                  icon={<HourglassEmptyIcon sx={{ color: "#ffffff", fontSize: 28 }} />}
                  gradient="linear-gradient(145deg, #ffecd2, #fcb69f)"
                  description="Na fila de atendimento"
                />
                
                <ModernCard
                  title="Finalizados"
                  value={counters.supportFinished || 0}
                  icon={<CheckCircleIcon sx={{ color: "#ffffff", fontSize: 28 }} />}
                  gradient="linear-gradient(145deg, #a8edea, #fed6e3)"
                  description="Atendimentos concluídos"
                />
                
                <ModernCard
                  title="Grupos"
                  value={counters.supportGroups || 0}
                  icon={<Groups sx={{ color: "#ffffff", fontSize: 28 }} />}
                  gradient="linear-gradient(145deg, #d299c2, #fef9d7)"
                  description="Grupos ativos"
                />
                
                <ModernCard
                  title="Atendentes Online"
                  value={`${GetUsers()}/${attendants.length}`}
                  icon={<RecordVoiceOverIcon sx={{ color: "#ffffff", fontSize: 28 }} />}
                  gradient="linear-gradient(145deg, #89f7fe, #66a6ff)"
                  description="Agentes disponíveis"
                />
                
                <ModernCard
                  title="Novos Contatos"
                  value={counters.leads || 0}
                  icon={<GroupAddIcon sx={{ color: "#ffffff", fontSize: 28 }} />}
                  gradient="linear-gradient(145deg, #fa709a, #fee140)"
                  description="Leads gerados hoje"
                />
              </Box>

              {/* Gráficos */}
              <Grid2 container spacing={4} sx={{ mb: 4 }}>
                <Grid2 xs={12} lg={6}>
                  <Box className={classes.chartCard}>
                    <Typography className={classes.chartTitle}>
                      📊 Total de Atendimentos
                    </Typography>
                    <Box className={classes.chartContainer}>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#00b894" stopOpacity={0.3}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="status" tick={{ fill: '#a0a0a0' }} />
                          <YAxis tick={{ fill: '#a0a0a0' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1a1a1a', 
                              border: '1px solid #333', 
                              borderRadius: '8px',
                              color: '#ffffff'
                            }} 
                          />
                          <Bar dataKey="quantidade" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>
                </Grid2>

                <Grid2 xs={12} lg={6}>
                  <Box className={classes.chartCard}>
                    <Typography className={classes.chartTitle}>
                      👥 Atendimentos por Usuário
                    </Typography>
                    <Box className={classes.chartContainer}>
                      <ChatsUser />
                    </Box>
                  </Box>
                </Grid2>
              </Grid2>

              {/* Gráfico de Timeline */}
              <Box className={classes.chartCard} sx={{ mb: 4 }}>
                <Typography className={classes.chartTitle}>
                  📈 Timeline de Atendimentos
                </Typography>
                <Box className={classes.chartContainer} sx={{ minHeight: "400px" }}>
                  <ChartsDate />
                </Box>
              </Box>

              {/* Card de Performance */}
              <Box className={classes.performanceCard}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: "#ffffff", mb: 3 }}>
                  🎯 Análise de Performance
                </Typography>
                <Grid2 container spacing={4}>
                  <Grid2 xs={12} md={6}>
                    <PerformanceCard
                      title="Taxa de Resolução"
                      value={counters.supportFinished || 0}
                      max={(counters.supportFinished + counters.supportPending) || 1}
                      color="#00d4aa"
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <PerformanceCard
                      title="Eficiência do Atendimento"
                      value={GetUsers()}
                      max={attendants.length || 1}
                      color="#4facfe"
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <PerformanceCard
                      title="Conversão de Leads"
                      value={counters.leads || 0}
                      max={Math.max(counters.leads * 1.5, 100)}
                      color="#fa709a"
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <PerformanceCard
                      title="Satisfação do Cliente"
                      value={85}
                      max={100}
                      color="#89f7fe"
                    />
                  </Grid2>
                </Grid2>
              </Box>

              {/* Dialog de Filtros */}
              <Dialog
                open={showFilter}
                onClose={toggleShowFilter}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  className: classes.dialogPaper,
                }}
              >
                <DialogTitle className={classes.dialogTitle}>
                  🔍 Filtros Avançados
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                  <Filters
                    classes={classes}
                    setDateStartTicket={setDateStartTicket}
                    setDateEndTicket={setDateEndTicket}
                    dateStartTicket={dateStartTicket}
                    dateEndTicket={dateEndTicket}
                    setQueueTicket={setQueueTicket}
                    queueTicket={queueTicket}
                    fetchData={setFetchDataFilter}
                  />
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                  <Button
                    onClick={toggleShowFilter}
                    sx={{
                      color: "#ffffff",
                      background: "linear-gradient(145deg, #ff6b6b, #ee5a52)",
                      borderRadius: "8px",
                      px: 3,
                      "&:hover": {
                        background: "linear-gradient(145deg, #ee5a52, #dc5454)",
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => { setFetchDataFilter(!fetchDataFilter); toggleShowFilter(); }}
                    sx={{
                      color: "#ffffff",
                      background: "linear-gradient(145deg, #00d4aa, #00b894)",
                      borderRadius: "8px",
                      px: 3,
                      ml: 2,
                      "&:hover": {
                        background: "linear-gradient(145deg, #00b894, #009688)",
                      }
                    }}
                  >
                    Aplicar Filtros
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
      }
    </>
  );
};

export default Dashboard;