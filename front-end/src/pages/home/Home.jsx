import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BugReport from '@mui/icons-material/BugReport';
import TestPage from '../testPage/TestPage';
import TestPage2 from '../testPage2/TestPage2';

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
      case 'Teste':
        return <TestPage />;
      case 'Teste2':
        return <TestPage2 />;
      default:
        return <h2>Home Component</h2>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
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

      {/* Drawer */}
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
        <Toolbar />
        <List>
          <ListItem button onClick={() => handleMenuClick('Teste')}>
            <ListItemIcon>
              <BugReport />
            </ListItemIcon>
            <ListItemText primary="Teste" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('Teste2')}>
            <ListItemIcon>
              <BugReport />
            </ListItemIcon>
            <ListItemText primary="Teste 2" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '16px' }}>
        <Toolbar />
        <h1>Content goes here</h1>
        {renderComponent()}
      </main>
    </div>
  );
}
