import { useState } from 'react';
import { TextField, Button, Container, Paper} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../../components/AlertContext.jsx";
import auth from '../../api/requests/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmail(email);
    
    if (email && !validateEmail(email)) {
      setEmailError('E-mail inválido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async () => {
    const data = {
      login: email
    }

    try {
      await auth.recoverRequest(data);
      addAlert('Solicitação de senha para recuperar requisitada com sucesso!', 'success');
      handleBack();
    } catch (error) {
      console.log(error);
      addAlert('Erro ao solicitar a recuperação de senha', 'error');
    }
  };
  
  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Container maxWidth="sm" className="mt-10">
        <Paper elevation={3} className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Esqueceu a senha?</h2>
          <div className="space-y-4">
            <div>
            <TextField
                label="E-mail"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                className="w-full bg-blue-500 text-white"
                disabled={emailError || email === ''}
              >
                Solicitar redefinição
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleBack}
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
