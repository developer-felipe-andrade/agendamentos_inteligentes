// AlertContext.js
import { createContext, useContext, useState, useCallback } from "react";
import { Snackbar, Alert as MuiAlert } from "@mui/material";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();
    setAlerts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={6000}
          onClose={() => removeAlert(alert.id)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiAlert
            severity={alert.type}
            onClose={() => removeAlert(alert.id)}
            elevation={6}
            variant="filled"
            sx={{ minWidth: 300 }}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
