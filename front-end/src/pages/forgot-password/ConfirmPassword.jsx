import React from 'react'
import Alert from '../../components/UseAlert';
import { Button, Container, Paper, TextField } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import auth from '../../api/requests/auth';

const ConfirmPassword = () => {
    const { renderAlerts, addAlert } = Alert();
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({email: '', password: '', confirmPassword: ''});
    const [searchParams] = useSearchParams();

    const getParamsUrl = () => {
        setFormData({ ...formData, email: searchParams.get('email') });
    }

    const handleResetPassword = async () => {
        if (!formData.password || !formData.confirmPassword) {
            alert("Por favor, preencha todos os campos.");
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem. Por favor, verifique.");
            return;
        }

        const request = {
            login: formData.email,
            password: formData.password
        }

        try {
            await auth.recover(request);
            handleBack();
            addAlert('Senha redefinida com sucesso!', 'success');
        } catch (error) {
            console.log(error);
            addAlert('Houve um erro ao redefinir sua senha, entre em contato com o administrador!', 'error');
        }
    }

    React.useEffect(() => {
        getParamsUrl();
    });

    const handleBack = () => {
        navigate('/login');
    }

    return (
        <div className="flex items-center justify-center h-screen">
          {renderAlerts()}
          <Container maxWidth="sm" className="mt-10">
            <Paper elevation={3} className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h2>
              <div className="space-y-4">
                <div>
                  <TextField
                    label="Nova Senha"
                    variant="outlined"
                    type="password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div>
                  <TextField
                    label="Confirme Nova Senha"
                    variant="outlined"
                    type="password"
                    fullWidth
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
      
                <div className="flex justify-center">
                  <Button
                    onClick={handleResetPassword}
                    variant="contained"
                    color="primary"
                    className="w-full bg-blue-500 text-white"
                  >
                    Redefinir Senha
                  </Button>
                </div>
      
                <div className="flex justify-center">
                  <Button onClick={handleBack} variant="text">
                    Voltar
                  </Button>
                </div>
              </div>
            </Paper>
          </Container>
        </div>
      );      
}

export default ConfirmPassword
