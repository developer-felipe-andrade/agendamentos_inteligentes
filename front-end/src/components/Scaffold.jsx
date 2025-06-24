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
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth,
  Inventory2,
  Person,
  Class,
  Logout,
  Mail,
  EventAvailable,
  Description,
  Home,
  Search,
  FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import auth from '../api/requests/auth';
import user from '../api/requests/user';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Alert from './UseAlert';
import ReservePerHour from '../pages/reservePerHour/ReservePerHour';
import ConnectionDialog from '../pages/config-email/ConnectionDialog';
import ImportUsersDialog from '../pages/import-users/ImportUsers';
import ReviewDialog from '../pages/review/ReviewDialog';

const drawerWidth = 240;

export default function Scaffold({ children, appBarActions }) {
  Scaffold.propTypes = {
    children: PropTypes.node.isRequired, 
    appBarActions: PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.element.isRequired,
      onClick: PropTypes.func.isRequired,
    })),
  };

  const [open, setOpen] = React.useState(false);
  const [userContent, setUserContent] = useState({});
  const { renderAlerts, addAlert } = Alert();
  const navigate = useNavigate();

  const [isReserveModalOpen, setReserveModalOpen] = useState(false);
  const [isEmailConfigModalOpen, setIsEmailConfigModalOpen] = useState(false);
  const [isImportUsersModalOpen, setIsImportUsersModalOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

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
      approveSchedules: '/aprove-schedule',
      reportReserves: '/report-reserve',
      reportClassroom: '/report-classroom',
      importUsers: '/import-users',
    };
    
    if (componentName === 'config-email') {
      setIsEmailConfigModalOpen(true)
    } else if (componentName === 'import-users') {
      setIsImportUsersModalOpen(true);
    } else {
      navigate(routes[componentName] || '/');
      setOpen(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const offlineParam = searchParams.get('offline');
    setIsOffline(offlineParam === 'true');
  
    async function fetchData() {
      try {
        const { data } = await user.me();
        setUserContent(data);

        // Se existirem avaliações pendentes, abre o diálogo de avaliação
        if (data.pendingReviews && data.pendingReviews.length > 0) {
          setIsReviewDialogOpen(true);
        }
      } catch {
        navigate('/login');
      }
    }
    if (!isOffline) {
      fetchData();
    }
  }, [isOffline, navigate]);

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
  };

  return !isOffline && (
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
            {/* Renderiza ícones da AppBar se forem passados via props */}
            {appBarActions?.map(({ icon, onClick }, index) => (
              <IconButton key={index} color="inherit" onClick={onClick}>
                {icon}
              </IconButton>
            ))}
            <IconButton disabled={!!appBarActions} edge="end" color="inherit" aria-label="logout" onClick={handleLogout}>
              <Logout />
            </IconButton>
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
          <ListItem onClick={() => navigate('/')}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>

          <ListItem onClick={() => setReserveModalOpen(true)}>
            <ListItemIcon>
              <Search />
            </ListItemIcon>
            <ListItemText primary="Encontre uma sala" />
          </ListItem>

          <ListItem onClick={() => handleMenuClick('reserve')}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            <ListItemText primary="Reservar" />
          </ListItem>

          {['ADMIN', 'WORKER'].includes(userContent.role) && 
            <ListItem key="approveSchedules" onClick={() => handleMenuClick('approveSchedules')}>
              <ListItemIcon>
                <EventAvailable />
              </ListItemIcon>
              <ListItemText primary="Aprovar Reservas" />
            </ListItem>
          }

          {userContent.role === 'ADMIN' &&
            [
              { key: 'aproveUsers', icon: <Person />, text: 'Aprovar Usuários' },
              { key: 'resources', icon: <Inventory2 />, text: 'Recursos' },
              { key: 'classroom', icon: <Class />, text: 'Salas' },
              { key: 'config-email', icon:<Mail/>, text: 'Configurar E-mail para Envio'},
              { key: 'reportReserves', icon:<Description/>, text: 'Relatório de reservas'},
              { key: 'reportClassroom', icon:<Description/>, text: 'Relatório de recursos por sala'},
              { key: 'import-users', icon:<FileUploadIcon />, text: 'Importar Usuários'}
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

      {isReserveModalOpen && (
        <ReservePerHour 
          isOpen={isReserveModalOpen} 
          setIsOpen={setReserveModalOpen} 
        />
      )}

      {isEmailConfigModalOpen && (
        <ConnectionDialog 
          open={isEmailConfigModalOpen} 
          onClose={() => setIsEmailConfigModalOpen(false)} 
        />
      )}

      {isImportUsersModalOpen && (
        <ImportUsersDialog 
          open={isImportUsersModalOpen} 
          onClose={() => setIsImportUsersModalOpen(false)} 
        />
      )}
 
      {isReviewDialogOpen && (
        <ReviewDialog
          reservationsId={userContent.pendingReviews}
          open={isReviewDialogOpen} 
          onClose={handleCloseReviewDialog}
        />
      )}

    </Box>
  );
}
