import { useState } from 'react';
import { TextField, Button, Container, Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/UseAlert';


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { renderAlerts, addAlert } = Alert();


  const handleSubmit = async () => {
    const data = {
      login: email,
      password: password
    }

    try {
      await auth.recover(data);
      addAlert('Solicitação de senha para recuperar requisitada com sucesso!', 'success');
      handleLogin();
    } catch (error) {
      addAlert(error, 'error');
    }
  };
  
  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Container maxWidth="sm" className="mt-10">
        <Paper elevation={3} className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Esqueceu a senha?</h2>
          <div className="space-y-4">
            <div>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                className="w-full bg-blue-500 text-white"
              >
                Redefinir Senha
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleLogin}
                variant="text"
              >
                Voltar
              </Button>
            </div>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default ForgotPassword;
