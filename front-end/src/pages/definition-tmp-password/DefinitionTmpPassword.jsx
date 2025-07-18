import { useState, useMemo } from 'react';
import { Button, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import auth from '../../api/requests/auth';
import PropTypes from 'prop-types';
import { useAlert } from "../../components/AlertContext.jsx";

const DefinitionTmpPassword = ({ open, onClose, onSuccess, userEmail}) => {
  const { addAlert } = useAlert();
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

  const handlePasswordReset = async () => {
    try {
      const request = {
        login: userEmail,
        password: newPassword
      };
      
      await auth.recover(request);
      
      addAlert('Senha redefinida com sucesso! Por favor, faça login novamente.', 'success');
      onSuccess();
      
      onClose();
    } catch (error) {
      console.log(error);
      addAlert('Erro ao redefinir a senha. Tente novamente.', 'error');
    } finally {
      setNewPassword('');
    }
  };

  const handleCloseModal = () => {
    setNewPassword('');
    onClose();
  };

  const isNewPasswordValid = useMemo(() => {
    return newPassword && newPassword.length >= 1;
  }, [newPassword]);

  return (
    <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>
          Redefina sua senha temporária <br/>
          Sua senha é temporária e precisa ser alterada antes de continuar.
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth variant="outlined" required margin='normal'>
            <InputLabel htmlFor="outlined-new-password">Nova Senha</InputLabel>
            <OutlinedInput
              id="outlined-new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nova Senha"
            />
          </FormControl>
                    
          <div className="flex justify-between mt-4">
            <Button onClick={handleCloseModal} variant="outlined" color="secondary">
              Cancelar
            </Button>
            <Button 
              onClick={handlePasswordReset} 
              variant="contained" 
              color="primary"
              disabled={!isNewPasswordValid}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>  
    </Dialog>
  );
};

DefinitionTmpPassword.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  userEmail: PropTypes.string.isRequired
};

export default DefinitionTmpPassword;