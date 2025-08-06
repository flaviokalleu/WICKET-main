import React, { useState, useEffect, useContext } from "react";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { makeStyles, Paper, Tabs, Tab } from "@material-ui/core";

import TabPanel from "../../components/TabPanel";

import SchedulesForm from "../../components/SchedulesForm";
import CompaniesManager from "../../components/CompaniesManager";
import PlansManager from "../../components/PlansManager";
import HelpsManager from "../../components/HelpsManager";
import Options from "../../components/Settings/Options";
import Whitelabel from "../../components/Settings/Whitelabel";
import UploaderCert from "../../components/Settings/UploaderCert";
import { i18n } from "../../translate/i18n.js";
import { toast } from "react-toastify";

import useCompanies from "../../hooks/useCompanies";
import { AuthContext } from "../../context/Auth/AuthContext";

import OnlyForSuperUser from "../../components/OnlyForSuperUser";
import useCompanySettings from "../../hooks/useSettings/companySettings";
import useSettings from "../../hooks/useSettings";
import ForbiddenPage from "../../components/ForbiddenPage/index.js";
import Empresa from "../../pages/Empresa"; // Importando o componente da página de Cadastro

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
  },
  mainPaper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    flex: 1,
    backgroundColor: "#0f0f0f",
    border: "1px solid #2a2a2a",
    borderRadius: "16px",
    margin: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#1a1a1a",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#404040",
      borderRadius: "3px",
      "&:hover": {
        backgroundColor: "#525252",
      },
    },
  },
  tab: {
    backgroundColor: "#1a1a1a",
    borderRadius: "16px 16px 0 0",
    borderBottom: "1px solid #2a2a2a",
    "& .MuiTab-root": {
      color: "#b3b3b3",
      fontWeight: "500",
      fontSize: "14px",
      textTransform: "none",
      minHeight: "56px",
      transition: "all 0.2s ease",
      "&:hover": {
        color: "#ffffff",
        backgroundColor: "#262626",
      },
      "&.Mui-selected": {
        color: "#437db5",
        backgroundColor: "#262626",
        borderRadius: "8px",
        margin: "4px",
      },
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#437db5",
      height: "3px",
      borderRadius: "3px",
    },
  },
  paper: {
    ...theme.scrollbarStyles,
    overflowY: "scroll",
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "#0f0f0f",
    borderRadius: "0 0 16px 16px",
    minHeight: "calc(100vh - 200px)",
  },
  container: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "#0f0f0f",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #2a2a2a",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  control: {
    padding: theme.spacing(2),
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #2a2a2a",
    margin: theme.spacing(1),
  },
  textfield: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#262626",
      borderRadius: "8px",
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
    "& .MuiOutlinedInput-input": {
      color: "#ffffff",
    },
  },
}));

const SettingsCustom = () => {
  const classes = useStyles();
  const [tab, setTab] = useState("options");
  const [schedules, setSchedules] = useState([]);
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [settings, setSettings] = useState({});
  const [oldSettings, setOldSettings] = useState({});
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);

  const { find, updateSchedules } = useCompanies();

  //novo hook
  const { getAll: getAllSettings } = useCompanySettings();
  const { getAll: getAllSettingsOld } = useSettings();
  const { user, socket } = useContext(AuthContext);

  useEffect(() => {
    async function findData() {
      setLoading(true);
      try {
        const companyId = user.companyId;
        const company = await find(companyId);

        const settingList = await getAllSettings(companyId);

        const settingListOld = await getAllSettingsOld();

        setCompany(company);
        setSchedules(company.schedules);
        setSettings(settingList);
        setOldSettings(settingListOld);

        /*  if (Array.isArray(settingList)) {
           const scheduleType = settingList.find(
             (d) => d.key === "scheduleType"
           );
           if (scheduleType) {
             setSchedulesEnabled(scheduleType.value === "company");
           }
         } */
        setSchedulesEnabled(settingList.scheduleType === "company");
        setCurrentUser(user);
      } catch (e) {
        toast.error(e);
      }
      setLoading(false);
    }
    findData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSubmitSchedules = async (data) => {
    setLoading(true);
    try {
      setSchedules(data);
      await updateSchedules({ id: company.id, schedules: data });
      toast.success("Horários atualizados com sucesso.");
    } catch (e) {
      toast.error(e);
    }
    setLoading(false);
  };

  const isSuper = () => {
    return currentUser.super;
  };

  return (
    <MainContainer className={classes.root}>
      {user.profile === "user" ?
        <ForbiddenPage />
        :
        <>
          <MainHeader>
            <Title style={{ color: "#ffffff" }}>{i18n.t("settings.title")}</Title>
          </MainHeader>
          <Paper className={classes.mainPaper} elevation={0}>
            <Tabs
              value={tab}
              indicatorColor="primary"
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "16px 16px 0 0",
                padding: "8px",
              }}
              scrollButtons="on"
              variant="scrollable"
              onChange={handleTabChange}
              className={classes.tab}
            >
              <Tab label={i18n.t("settings.tabs.options")} value={"options"} />
              {schedulesEnabled && <Tab label="Horários" value={"schedules"} />}
              {isSuper() ? <Tab label="Empresas" value={"companies"} /> : null}
              {isSuper() ? <Tab label={i18n.t("settings.tabs.plans")} value={"plans"} /> : null}
              {isSuper() ? <Tab label={i18n.t("settings.tabs.helps")} value={"helps"} /> : null}
              {isSuper() ? <Tab label="Whitelabel" value={"whitelabel"} /> : null}
              {isSuper() ? <Tab label="Certificado Efí PIX" value={"uploadercert"} /> : null}
              {isSuper() ? <Tab label="Cadastro" value={"cadastro"} /> : null} {/* Nova aba */}
            </Tabs>
            <Paper className={classes.paper} elevation={0}>
              <TabPanel
                className={classes.container}
                value={tab}
                name={"schedules"}
              >
                <SchedulesForm
                  loading={loading}
                  onSubmit={handleSubmitSchedules}
                  initialValues={schedules}
                />
              </TabPanel>
              <OnlyForSuperUser
                user={currentUser}
                yes={() => (
                  <>
                    <TabPanel
                      className={classes.container}
                      value={tab}
                      name={"companies"}
                    >
                      <CompaniesManager />
                    </TabPanel>

                    <TabPanel
                      className={classes.container}
                      value={tab}
                      name={"plans"}
                    >
                      <PlansManager />
                    </TabPanel>

                    <TabPanel
                      className={classes.container}
                      value={tab}
                      name={"helps"}
                    >
                      <HelpsManager />
                    </TabPanel>
                    <TabPanel
                      className={classes.container}
                      value={tab}
                      name={"whitelabel"}
                    >
                      <Whitelabel
                        settings={oldSettings}
                      />
                    </TabPanel>
                    <TabPanel
                      className={classes.container}
                      value={tab}
                      name={"uploadercert"}
                    >
                      <UploaderCert />
                    </TabPanel>
                    <TabPanel
                      className={classes.container}
                      value={tab}
                      name={"cadastro"} // Novo TabPanel para a aba de Cadastro
                    >
                      <Empresa /> {/* Renderizando o componente da página de Cadastro */}
                    </TabPanel>
                  </>
                )}
              />
              <TabPanel className={classes.container} value={tab} name={"options"}>
                <Options
                  settings={settings}
                  oldSettings={oldSettings}
                  user={currentUser}
                  scheduleTypeChanged={(value) =>
                    setSchedulesEnabled(value === "company")
                  }
                />
              </TabPanel>
            </Paper>
          </Paper>
        </>}
    </MainContainer>
  );
};

export default SettingsCustom;