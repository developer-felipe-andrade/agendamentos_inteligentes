import React, { useEffect, useState } from 'react';
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
  Avatar,
  Menu,
  MenuItem,
  ListItemAvatar,
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

const drawerWidth = 240;
export default function Scaffold({ children }) {
  Scaffold.propTypes = {
    children: PropTypes.node.isRequired, 
  };
  
  const [open, setOpen] = React.useState(false);
  const [userContent, setUserContent] = useState({});
  const [anchorEl, setAnchorEl] = useState(null); // Controla o Menu do Avatar
  const { renderAlerts, addAlert } = Alert();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
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
      aproveUsers: '/aprove-users',
      resources: '/resources',
      classroom: '/classrooms',
    };
    navigate(routes[componentName] || '/');
    setOpen(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await user.me();
        setUserContent(data);
      } catch {
        navigate('/login');
      }
    }
    fetchData();
  }, []);

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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="end" color="inherit" onClick={handleAvatarClick}>
              <Avatar alt={userContent.name} src={userContent.avatarUrl} />
            </IconButton>
            <IconButton edge="end" color="inherit" aria-label="logout" onClick={handleLogout}>
              <Logout />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem>{userContent.name}</MenuItem>
              <MenuItem>{userContent.login}</MenuItem>
              <MenuItem>{userContent.role}</MenuItem>
              <MenuItem>{userContent.profession}</MenuItem>
            </Menu>
          </Box>
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

          {userContent.role === 'ADMIN' &&
            [
              { key: 'aproveUsers', icon: <Person />, text: 'Aprovar Usuários' },
              { key: 'resources', icon: <Inventory2 />, text: 'Recursos' },
              { key: 'classroom', icon: <Class />, text: 'Salas' },
            ].map(({ key, icon, text }) => (
              <ListItem key={key} onClick={() => handleMenuClick(key)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
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
