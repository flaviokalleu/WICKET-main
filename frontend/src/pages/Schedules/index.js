import React, { useState, useEffect, useReducer, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import ScheduleModal from "../../components/ScheduleModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import moment from "moment";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import "./Schedules.css";

function getUrlParam(paramName) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(paramName);
}

const eventTitleStyle = {
  fontSize: "14px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  color: "#ffffff",
};

const localizer = momentLocalizer(moment);
const defaultMessages = {
  date: "Data",
  time: "Hora",
  event: "Evento",
  allDay: "Dia Todo",
  week: "Semana",
  work_week: "Agendamentos",
  day: "Dia",
  month: "Mês",
  previous: "Anterior",
  next: "Próximo",
  yesterday: "Ontem",
  tomorrow: "Amanhã",
  today: "Hoje",
  agenda: "Agenda",
  noEventsInRange: "Não há agendamentos no período.",
  showMore: (total) => `+${total} mais`,
};

const DragAndDropCalendar = withDragAndDrop(Calendar);

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_SCHEDULES":
      const schedules = action.payload;
      const newSchedules = [];

      schedules.forEach((schedule) => {
        const scheduleIndex = state.findIndex((s) => s.id === schedule.id);
        if (scheduleIndex !== -1) {
          state[scheduleIndex] = schedule;
        } else {
          newSchedules.push(schedule);
        }
      });

      return [...state, ...newSchedules];

    case "UPDATE_SCHEDULES":
      const schedule = action.payload;
      const scheduleIndex = state.findIndex((s) => s.id === schedule.id);

      if (scheduleIndex !== -1) {
        state[scheduleIndex] = schedule;
        return [...state];
      } else {
        return [schedule, ...state];
      }

    case "DELETE_SCHEDULE":
      const scheduleId = action.payload;

      const deleteIndex = state.findIndex((s) => s.id === scheduleId);
      if (deleteIndex !== -1) {
        state.splice(deleteIndex, 1);
      }
      return [...state];

    case "RESET":
      return [];

    default:
      return state;
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(3),
    overflowY: "scroll",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    borderRadius: "12px",
    ...theme.scrollbarStyles,
  },
  calendarToolbar: {
    '& .rbc-toolbar-label': {
      color: "#ffffff",
      fontWeight: 600,
    },
    '& .rbc-btn-group button': {
      color: "#ffffff",
      backgroundColor: "#2a2a2a",
      border: "1px solid #555555",
      borderRadius: "8px",
      margin: "0 2px",
      '&:hover': {
        backgroundColor: "#333333",
      },
      '&:active, &:focus, &.rbc-active': {
        backgroundColor: "#437db5",
        borderColor: "#437db5",
      },
    },
  },
  searchContainer: {
    padding: theme.spacing(2),
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    marginBottom: theme.spacing(2),
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      background: '#1a1a1a',
      color: '#ffffff',
      "&.Mui-focused fieldset": {
        borderColor: '#437db5',
      },
    },
    "& .MuiInputLabel-outlined": {
      color: '#cccccc',
    },
    "& .MuiInputLabel-outlined.Mui-focused": {
      color: '#437db5',
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: '#555555',
    },
  },
  addButton: {
    backgroundColor: "#437db5",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 20px",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#3a6ba5",
    },
  },
  mobileEventContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "4px",
    backgroundColor: "#2a2a2a",
    borderRadius: "4px",
  },
  mobileEventActions: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "4px",
  },
  mobileActionButton: {
    minWidth: "auto",
    padding: "4px",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#333333",
    },
  },
  calendarContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    padding: theme.spacing(2),
    "& .rbc-calendar": {
      backgroundColor: "transparent",
    },
    "& .rbc-month-view": {
      backgroundColor: "transparent",
    },
    "& .rbc-header": {
      backgroundColor: "#333333",
      color: "#ffffff",
      padding: "8px",
      borderRadius: "4px",
      marginBottom: "4px",
    },
    "& .rbc-date-cell": {
      color: "#ffffff",
    },
    "& .rbc-event": {
      backgroundColor: "#437db5",
      borderRadius: "4px",
      border: "none",
    },
    "& .rbc-today": {
      backgroundColor: "rgba(67, 125, 181, 0.2)",
    },
    "& .rbc-off-range-bg": {
      backgroundColor: "#1a1a1a",
    },
    "& .event-container": {
      backgroundColor: "#437db5",
      color: "#ffffff",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      position: "relative",
      cursor: "pointer",
      "& .delete-icon, & .edit-icon": {
        fontSize: "14px",
        position: "absolute",
        top: "2px",
        cursor: "pointer",
        "&:hover": {
          opacity: 0.7,
        },
      },
      "& .delete-icon": {
        right: "20px",
      },
      "& .edit-icon": {
        right: "4px",
      },
    },
    "& .rbc-agenda-view": {
      backgroundColor: "transparent",
      "& .rbc-agenda-table": {
        backgroundColor: "transparent",
        "& tbody tr": {
          backgroundColor: "#2a2a2a",
          color: "#ffffff",
          "&:nth-child(even)": {
            backgroundColor: "#333333",
          },
        },
        "& thead tr": {
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
        },
      },
    },
  },
}));

const Schedules = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user, socket } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [schedules, dispatch] = useReducer(reducer, []);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [contactId, setContactId] = useState(+getUrlParam("contactId"));

  const { getPlanCompany } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const companyId = user.companyId;
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useSchedules) {
        toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
        setTimeout(() => {
          history.push(`/`);
        }, 1000);
      }
    }
    fetchData();
  }, [user, history, getPlanCompany]);

  const fetchSchedules = useCallback(async () => {
    try {
      const { data } = await api.get("/schedules", {
        params: { searchParam, pageNumber },
      });

      dispatch({ type: "LOAD_SCHEDULES", payload: data.schedules });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  }, [searchParam, pageNumber]);

  const handleOpenScheduleModalFromContactId = useCallback(() => {
    if (contactId) {
      handleOpenScheduleModal();
    }
  }, [contactId]);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchSchedules();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, contactId, fetchSchedules, handleOpenScheduleModalFromContactId]);

  useEffect(() => {
    const onCompanySchedule = (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_SCHEDULES", payload: data.schedule });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_SCHEDULE", payload: +data.scheduleId });
      }
    };

    socket.on(`company${user.companyId}-schedule`, onCompanySchedule);

    return () => {
      socket.off(`company${user.companyId}-schedule`, onCompanySchedule);
    };
  }, [socket, user.companyId]);

  const cleanContact = () => {
    setContactId("");
  };

  const handleOpenScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setSelectedSchedule(null);
    setScheduleModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await api.delete(`/schedules/${scheduleId}`);
      toast.success(i18n.t("schedules.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingSchedule(null);
    setSearchParam("");
    setPageNumber(1);

    dispatch({ type: "RESET" });
    setPageNumber(1);
    await fetchSchedules();
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const updatedSchedule = { ...event, sendAt: start };
      await api.put(`/schedules/${event.id}`, updatedSchedule);
      dispatch({ type: "UPDATE_SCHEDULES", payload: updatedSchedule });
      toast.success(i18n.t("Agendamento atualizado com sucesso"));
    } catch (err) {
      toastError(err);
    }
  };

  const renderEvent = (schedule) => {
    if (isMobile) {
      return (
        <div className={classes.mobileEventContainer}>
          <div style={eventTitleStyle}>{schedule?.contact?.name}</div>
          <div className={classes.mobileEventActions}>
            <Button
              size="small"
              className={classes.mobileActionButton}
              onClick={() => handleDeleteSchedule(schedule.id)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </Button>
            <Button
              size="small"
              className={classes.mobileActionButton}
              onClick={() => {
                handleEditSchedule(schedule);
                setScheduleModalOpen(true);
              }}
            >
              <EditIcon fontSize="small" />
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div key={schedule.id} className="event-container" title={`Contato: ${schedule.contact.name}\nMensagem: ${schedule.body}`}>
          <div style={eventTitleStyle}>{schedule?.contact?.name}</div>
          <DeleteOutlineIcon
            onClick={() => handleDeleteSchedule(schedule.id)}
            className="delete-icon"
          />
          <EditIcon
            onClick={() => {
              handleEditSchedule(schedule);
              setScheduleModalOpen(true);
            }}
            className="edit-icon"
          />
        </div>
      );
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingSchedule &&
          `${i18n.t("schedules.confirmationModal.deleteTitle")}`
        }
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={() => handleDeleteSchedule(deletingSchedule.id)}
      >
        {i18n.t("schedules.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      {scheduleModalOpen && (
        <ScheduleModal
          open={scheduleModalOpen}
          onClose={handleCloseScheduleModal}
          reload={fetchSchedules}
          scheduleId={selectedSchedule ? selectedSchedule.id : null}
          contactId={contactId}
          cleanContact={cleanContact}
        />
      )}
      <MainHeader>
        <Title>{i18n.t("schedules.title")} ({schedules.length})</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("contacts.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "#437db5" }} />
                </InputAdornment>
              ),
            }}
            style={{ width: isMobile ? "100%" : "auto" }}
          />
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            className={classes.addButton}
            onClick={handleOpenScheduleModal}
          >
            {i18n.t("schedules.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined" onScroll={handleScroll}>
        <div className={classes.calendarContainer}>
          <DragAndDropCalendar
            messages={defaultMessages}
            formats={{
              agendaDateFormat: "DD/MM ddd",
              weekdayFormat: "dddd",
            }}
            localizer={localizer}
            events={schedules.map((schedule) => ({
              ...schedule,
              title: renderEvent(schedule),
              start: new Date(schedule.sendAt),
              end: new Date(schedule.sendAt),
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: isMobile ? 400 : 500 }}
            className={classes.calendarToolbar}
            onEventDrop={handleEventDrop}
            resizable
            selectable
          />
        </div>
      </Paper>
    </MainContainer>
  );
};

export default Schedules;