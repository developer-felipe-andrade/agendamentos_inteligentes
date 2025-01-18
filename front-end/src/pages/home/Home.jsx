import React, { useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { CalendarMonth, Inventory2, Person, Class, Logout } from '@mui/icons-material';
import auth from '../../api/requests/auth';
import user from '../../api/requests/user';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/UseAlert';

const drawerWidth = 240;

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const { renderAlerts, addAlert } = Alert();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.logout();
      Cookies.remove('authToken', { path: '/' });
    } catch(error) {
      console.log(error);
      addAlert('Ocorreu um erro ao deslogar, entre em contato com o Administrador!', 'error');
    } finally {
      navigate('/login');
    }
  }

  const handleMenuClick = (componentName) => {
    switch (componentName) {
      case 'reserve':
        navigate('/reserve');
        break;
      case 'users':
        navigate('/users');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'classroom':
        navigate('/classroom');
        break;
      default:
        navigate('/');
    }
    
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden'}}>
      {renderAlerts()}
      
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            My App
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="logout"
            onClick={handleLogout}
            sx={{ ml: 'auto' }}
          >
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
          <ListItem onClick={() => handleMenuClick('inventory')}>
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
        </List>
      </Drawer>
    </Box>
  );
}
