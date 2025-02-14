import { useState } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

const useAlert = (duration = 6000) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9); 
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const renderAlerts = () => (
    <>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={duration}
          onClose={() => removeAlert(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            zIndex: (theme) => theme.zIndex.snackbar + 1, 
          }}
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
    </>
  );

  return {
    renderAlerts,
    addAlert,
  };
};

export default useAlert;
