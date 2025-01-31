import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth,
  Inventory2,
  Person,
  Class,
  Logout,
} from '@mui/icons-material';
import auth from '../api/requests/auth';
import user from '../api/requests/user';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Alert from './UseAlert';
import WhatsAppQrModal from '../pages/whatsapp/WhatsAppQrModal';
import whatsapp from "../api/requests/whatsapp";

const drawerWidth = 240;
export default function Scaffold({ children }) {
	Scaffold.propTypes = {
		children: PropTypes.node.isRequired, 
	};
      
  const [open, setOpen] = React.useState(false);
  const { renderAlerts, addAlert } = Alert();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
    if (open) {
      checkWhatsAppStatus();
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      Cookies.remove('authToken', { path: '/' });
    } catch (error) {
      console.log(error);
      addAlert('Ocorreu um erro ao deslogar, entre em contato com o Administrador!', 'error');
    } finally {
      navigate('/login');
    }
  };

  const handleMenuClick = (componentName) => {
    const routes = {
      reserve: '/reserve',
      users: '/users',
      resources: '/resources',
      classroom: '/classrooms',
    };
    navigate(routes[componentName] || '/');
    setOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        await user.me();
      } catch {
        navigate('/login');
      }
    }
    fetchData();
  }, []);

  const checkWhatsAppStatus = async () => {
    try {
      const { data } = await whatsapp.status();
      setIsConnected(data.connected);
      console.log(isConnected);
    } catch (error) {
      console.error("Erro ao verificar status do WhatsApp:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      { renderAlerts() }
			<AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Agenda Inteligente
          </Typography>
          <IconButton edge="end" color="inherit" aria-label="logout" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <List className="cursor-pointer">
          <ListItem onClick={() => handleMenuClick('reserve')}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            <ListItemText primary="Reservar" />
          </ListItem>
          <ListItem onClick={() => handleMenuClick('users')}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Usuários" />
          </ListItem>
          <ListItem onClick={() => handleMenuClick('resources')}>
            <ListItemIcon>
              <Inventory2 />
            </ListItemIcon>
            <ListItemText primary="Recursos" />
          </ListItem>
          <ListItem onClick={() => handleMenuClick('classroom')}>
            <ListItemIcon>
              <Class />
            </ListItemIcon>
            <ListItemText primary="Salas" />
          </ListItem>

          { !isConnected && <WhatsAppQrModal />}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px', 
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}