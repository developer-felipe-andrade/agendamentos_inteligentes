import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Calendar from '../calendar/Calendar';
import { CalendarMonth, Inventory2, Person, Class } from '@mui/icons-material';
import Users from '../users/Users';
import Inventory from '../inventory/Inventory';
import Room from '../rooms/Room';

const drawerWidth = 240;

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Inbox');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuClick = (componentName) => {
    setSelectedComponent(componentName);
    setOpen(false);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'agenda':
        return <Calendar />;
      case 'users':
        return <Users />;
      case 'inventory':
        return <Inventory />;
      case 'room':
        return <Room />;
      default:
        return <h2>Home Component</h2>;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden'}}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
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
          <ListItem onClick={() => handleMenuClick('agenda')}>
            <ListItemIcon>
              <CalendarMonth />
            </ListItemIcon>
            <ListItemText primary="Agenda" />
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
          <ListItem onClick={() => handleMenuClick('room')}>
            <ListItemIcon>
              <Class />
            </ListItemIcon>
            <ListItemText primary="Salas" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {renderComponent()}
      </Box>
    </Box>
  );
}
