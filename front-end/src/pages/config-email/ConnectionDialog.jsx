import { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, FormControlLabel, Button, Box, Grid, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ConnectionDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [port, setPort] = useState('');
  const [useSSL, setUseSSL] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTestConnection = () => {
    // Lógica para testar a conexão
    console.log('Testando conexão...', { email, password, server, port, useSSL });
  };

  const handleSave = () => {
    // Lógica para salvar as configurações
    console.log('Salvando configurações...', { email, password, server, port, useSSL });
  };

  const handleCancel = () => {
    onClose(); // Fecha o modal quando o botão Cancelar for clicado
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Configurações de Conexão</DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" required margin="normal">
          <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Senha"
          />
        </FormControl>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Servidor"
              fullWidth
              margin="normal"
              value={server}
              onChange={(e) => setServer(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Porta"
              type="number"
              fullWidth
              margin="normal"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Checkbox
              checked={useSSL}
              onChange={(e) => setUseSSL(e.target.checked)}
              color="primary"
            />
          }
          label="Usar SSL"
        />

        <Box sx={{ mt: 2 }}>
          <Button onClick={handleTestConnection} color="primary">
            Testar Conexão
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConnectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConnectionDialog;
