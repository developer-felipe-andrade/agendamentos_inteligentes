import { useMemo, useState } from 'react';
import { TextField, Button, Container, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/UseAlert';
import auth from '../../api/requests/auth';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({login: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { renderAlerts, addAlert } = Alert();
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!formData.login || !formData.password) {
        addAlert('Por favor, preencha todos os campos!', 'warning');
        return;
      }
      
      const { data } = await auth.login(formData);

      Cookies.set('authToken', data.token, { 
        expires: 7,
        path: '/'
      });
      
      addAlert('Login efetuado com sucesso!', 'success');

      navigate('/inicio');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao acessar!', 'error');
    }
  };

  const handleForgotPassword = () => {
    navigate('/esqueceu-senha');
  };

  const handleCreateUser = () => {
    navigate('/cadastrar');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const login = e.target.value;
    setFormData({ ...formData, login });
    
    if (login && !validateEmail(login)) {
      setEmailError('E-mail inválido');
    } else {
      setEmailError('');
    }
  };

  const isFormValid = useMemo(() => {
      return Object.values(formData).every(value => value.trim() !== '') && 
             validateEmail(formData.login) && 
             !emailError;
    }, [formData, emailError]);

  return (
    <>
      <div className="flex items-center justify-center h-screen">
      {renderAlerts()}
        <Container maxWidth="sm" className="mt-10">
          <Paper elevation={3} className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <div className="space-y-4">
              <TextField
                label="E-mail"
                variant="outlined"
                fullWidth
                required
                value={formData.login}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
              <div>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          value={formData.password}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Senha"
                  />
                </FormControl>
            
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button
                    variant="text"
                    color="primary"
                    className='text-sm text'
                    onClick={handleCreateUser}
                  >
                    Cadastrar
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    className='text-sm text'
                    onClick={handleForgotPassword}
                  >
                    Esqueceu sua senha?
                  </Button>
                </Box>
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={handleLogin}
                  variant="contained"
                  color="primary"
                  className="w-full bg-blue-500 text-white"
                  disabled={!isFormValid}
                >
                  Acessar
                </Button>
              </div>
            </div>
          </Paper>
        </Container>
      </div>
    </>
  );
};

export default Login;