import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, 
  FormControlLabel, Button, Box, Grid, FormControl, InputLabel, OutlinedInput, 
  InputAdornment, IconButton, CircularProgress 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import emailConfig from '../../api/requests/email-config';
import Alert from '../../components/UseAlert';

const ConnectionDialog = ({ open, onClose }) => {
  const { renderAlerts, addAlert } = Alert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [port, setPort] = useState(587);
  const [useSSL, setUseSSL] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isNotTestConnection, setIsNotTestConnection] = useState(true);
  const [loadingTest, setLoadingTest] = useState(false);

  useEffect(() => {
    if (open) {
      loadConfig();
    }
  }, [open]);

  const loadConfig = async () => {
    try {
      const { data } = await emailConfig.findConfig();
      if (data) {
        setEmail(data.email || '');
        setPassword(data.password || '');
        setServer(data.host || '');
        setPort(data.port || 587);
        setUseSSL(data.useSSL ?? true);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      addAlert('Erro ao carregar as configurações do e-mail', 'error');
    }
  };

  const handleTestConnection = async () => {
    setLoadingTest(true);
    const payload = { username: email, password, host: server, port, useSSL };
    try {
      const { data } = await emailConfig.testConnection(payload);
      if (data) {
        addAlert('Autenticado com sucesso, pode salvar as configurações', 'success');
      } else {
        addAlert('Erro de autenticação, verifique seus dados', 'error');
      }
      setIsNotTestConnection(!data);
    } catch (error) {
      console.log(error);
      addAlert('Erro ao testar conexão', 'error');
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = { username: email, password, host: server, port, useSSL };
      await emailConfig.save(payload);
      addAlert('E-mail configurado com sucesso', 'success');
    } catch (error) {
      console.error(error);
      addAlert('Erro ao salvar a configuração de e-mail', 'error');
    } finally {
      handleCancel();
    }
  };

  const handleDelete = async () => {
    try {
      await emailConfig.delete();
      addAlert('Configuração excluída com sucesso', 'success');
    } catch (error) {
      console.error(error);
      addAlert('Erro ao excluir a configuração de e-mail', 'error');
    } finally {
      handleCancel();
    }
  };

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  const resetFields = () => {
    setEmail('');
    setPassword('');
    setServer('');
    setPort(587);
    setUseSSL(true);
    setShowPassword(false);
    setIsNotTestConnection(true);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {renderAlerts()}
      <DialogTitle>Configurações de Conexão</DialogTitle>
      <DialogContent>
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormControl fullWidth variant="outlined" required margin="normal">
          <InputLabel htmlFor="outlined-adornme nt-password">Senha</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Senha"
          />
        </FormControl>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Servidor" fullWidth margin="normal" value={server} onChange={(e) => setServer(e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Porta" type="number" fullWidth margin="normal" value={port} onChange={(e) => setPort(e.target.value)} />
          </Grid>
        </Grid>
        
        <FormControlLabel control={<Checkbox checked={useSSL} onChange={(e) => setUseSSL(e.target.checked)} color="primary" />} label="Usar SSL" />
        <Box sx={{ mt: 2 }}>
          <Button 
            onClick={handleTestConnection} 
            color="primary" 
            disabled={loadingTest} 
            startIcon={loadingTest ? <CircularProgress size={20} /> : null}
          >
            {loadingTest ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={handleDelete} variant="contained" color="error">Excluir</Button>
        <Box>
          <Button onClick={handleCancel} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={isNotTestConnection}>Salvar</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

ConnectionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConnectionDialog;
