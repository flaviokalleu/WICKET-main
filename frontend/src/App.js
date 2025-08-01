import React, { useState, useEffect, useMemo } from "react";
import api from "./services/api";
import "react-toastify/dist/ReactToastify.css";
import "./styles/darkTheme.css";
import "./styles/modalFix.css";
import "./styles/modernDesign.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";
import { ActiveMenuProvider } from "./context/ActiveMenuContext";
import Favicon from "react-favicon";
import { getBackendUrl } from "./config";
import Routes from "./routes";
import defaultLogoLight from "./assets/logo.png";
import defaultLogoDark from "./assets/logo-black.png";
import defaultLogoFavicon from "./assets/favicon.ico";
import useSettings from "./hooks/useSettings";

const queryClient = new QueryClient();

const App = () => {
  const [locale, setLocale] = useState();
  const appColorLocalStorage = localStorage.getItem("primaryColorDark") || "#065183";
  const appNameLocalStorage = localStorage.getItem("appName") || "";
  const [mode] = useState("dark"); // Sempre dark
  const [primaryColorLight, setPrimaryColorLight] = useState(appColorLocalStorage);
  const [primaryColorDark, setPrimaryColorDark] = useState(appColorLocalStorage);
  const [appLogoLight, setAppLogoLight] = useState(defaultLogoLight);
  const [appLogoDark, setAppLogoDark] = useState(defaultLogoDark);
  const [appLogoFavicon, setAppLogoFavicon] = useState(defaultLogoFavicon);
  const [appName, setAppName] = useState(appNameLocalStorage);
  const { getPublicSetting } = useSettings();

  const colorMode = useMemo(
    () => ({
      setPrimaryColorDark,
      setAppLogoLight,
      setAppLogoDark,
      setAppLogoFavicon,
      setAppName,
      appLogoLight,
      appLogoDark,
      appLogoFavicon,
      appName,
      mode,
    }),
    [appLogoLight, appLogoDark, appLogoFavicon, appName, mode]
  );

  const theme = useMemo(
    () =>
      createTheme(
        {
          scrollbarStyles: {
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
              backgroundColor: primaryColorDark,
            },
          },
          scrollbarStylesSoft: {
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#333333",
            },
          },
          palette: {
            mode: "dark",
            type: "dark",
            primary: { main: "#00d4aa" },
            secondary: { main: "#333333" },
            background: {
              default: "#0f0f0f",
              paper: "#1a1a1a",
              color: "#1a1a1a",
            },
            text: {
              primary: "#ffffff",
              secondary: "#a0a0a0",
            },
            textPrimary: "#00d4aa",
            borderPrimary: "#333333",
            dark: { main: "#ffffff" },
            light: { main: "#1a1a1a" },
            fontColor: "#00d4aa",
            tabHeaderBackground: "#1e1e1e",
            optionsBackground: "#1a1a1a",
            fancyBackground: "#1a1a1a",
            total: "#0f0f0f",
            messageIcons: "#ffffff",
            inputBackground: "#2a2a2a",
            barraSuperior: "#1e1e1e",
          },
          appLogoLight,
          appLogoDark,
          appLogoFavicon,
          appName,
          calculatedLogoDark: () => {
            if (appLogoDark === defaultLogoDark && appLogoLight !== defaultLogoLight) {
              return appLogoLight;
            }
            return appLogoDark;
          },
          calculatedLogoLight: () => {
            if (appLogoDark !== defaultLogoDark && appLogoLight === defaultLogoLight) {
              return appLogoDark;
            }
            return appLogoLight;
          },
          overrides: {
            MuiDialog: {
              root: {
                zIndex: 1500,
              },
              paper: {
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                maxHeight: "90vh",
                margin: "32px",
                borderRadius: "8px",
              },
            },
            MuiDialogTitle: {
              root: {
                backgroundColor: "#333333",
                color: "#ffffff",
                padding: "16px 24px",
              },
            },
            MuiDialogContent: {
              root: {
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                padding: "20px 24px",
              },
            },
            MuiDialogActions: {
              root: {
                backgroundColor: "#1a1a1a",
                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                padding: "8px",
              },
            },
            MuiBackdrop: {
              root: {
                zIndex: 1400,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        },
        locale
      ),
    [appLogoLight, appLogoDark, appLogoFavicon, appName, locale, primaryColorDark]
  );

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    const browserLocale = i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

    if (browserLocale === "ptBR") {
      setLocale(ptBR);
    }
  }, []);

  useEffect(() => {
    // Removido: não salva mais tema no localStorage
  }, []);

  useEffect(() => {
    console.log("|=========== handleSaveSetting ==========|")
    console.log("APP START")
    console.log("|========================================|")
   
    
    getPublicSetting("primaryColorLight")
      .then((color) => {
        setPrimaryColorLight(color || "#0000FF");
      })
      .catch((error) => {
        console.log("Error reading setting", error);
      });
    getPublicSetting("primaryColorDark")
      .then((color) => {
        setPrimaryColorDark(color || "#39ACE7");
      })
      .catch((error) => {
        console.log("Error reading setting", error);
      });
    getPublicSetting("appLogoLight")
      .then((file) => {
        setAppLogoLight(file ? getBackendUrl() + "/public/" + file : defaultLogoLight);
      })
      .catch((error) => {
        console.log("Error reading setting", error);
      });
    getPublicSetting("appLogoDark")
      .then((file) => {
        setAppLogoDark(file ? getBackendUrl() + "/public/" + file : defaultLogoDark);
      })
      .catch((error) => {
        console.log("Error reading setting", error);
      });
    getPublicSetting("appLogoFavicon")
      .then((file) => {
        setAppLogoFavicon(file ? getBackendUrl() + "/public/" + file : defaultLogoFavicon);
      })
      .catch((error) => {
        console.log("Error reading setting", error);
      });
    getPublicSetting("appName")
      .then((name) => {
        setAppName(name || "Chat-flow");
      })
      .catch((error) => {
        console.log("!==== Erro ao carregar temas: ====!", error);
        setAppName("chat-flow");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primaryColor", primaryColorDark);
  }, [primaryColorDark]);

  useEffect(() => {
    async function fetchVersionData() {
      try {
        const response = await api.get("/version");
        const { data } = response;
        window.localStorage.setItem("frontendVersion", data.version);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    }
    fetchVersionData();
  }, []);

  return (
    <>
      <Favicon url={appLogoFavicon ? getBackendUrl() + "/public/" + appLogoFavicon : defaultLogoFavicon} />
      <ColorModeContext.Provider value={{ colorMode }}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <ActiveMenuProvider>
              <Routes />
            </ActiveMenuProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default App;
