import { useEffect, useMemo, useState } from 'react';
import { TextField, Button, Container, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAlert } from "../../components/AlertContext.jsx";
import auth from '../../api/requests/auth';
import Cookies from 'js-cookie';
import logo from '../../assets/logo.png';
import DefinitionTmpPassword from '../definition-tmp-password/DefinitionTmpPassword';

const Login = () => {
  const [formData, setFormData] = useState({login: '', password: '' });
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const { addAlert } = useAlert();
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!formData.login || !formData.password) {
        addAlert('Por favor, preencha todos os campos!', 'warning');
        return;
      }
      const { data } = await auth.login(formData);

      if (data.isTmpPassword) {
        setOpenPasswordModal(true);
        return;
      }

      Cookies.set('authToken', data.token, { 
        expires: 7,
        path: '/'
      });
      
      addAlert('Login efetuado com sucesso!', 'success');
      
      navigate('/');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao acessar!', 'error');
      return;
    }
  };

  const handlePasswordResetSuccess = () => {
    setFormData({...formData, password: ''});
  };

  const handleCloseModal = () => {
    setOpenPasswordModal(false);
  };

  const handleLogout = async () => {
    try {
      Cookies.remove('authToken', { path: '/' });
    } catch(error) {
      console.log(error);
      addAlert('Erro ao limpar os cookies, entre em contato com o administrador', 'error');
    }
  }

  useEffect(() => {
    handleLogout();
  }, []); 

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleCreateUser = () => {
    navigate('/register');
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
      <div 
        className="flex items-center justify-center h-screen"
        onKeyDown={(e) => {
          if(e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
          }
        }}
      >
        <Container maxWidth="sm" className="mt-10">
          <Paper elevation={3} className="p-6">
            <div className='flex justify-center mb-4  '>
              <img 
                src={logo}
                width={900}
                height={900}
                alt='logo teste'
                loading="lazy"
              />  
            </div>
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
                    value={formData.password}
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

      <DefinitionTmpPassword 
        open={openPasswordModal}
        onClose={handleCloseModal}
        userEmail={formData.login}
        onSuccess={handlePasswordResetSuccess}
      />
    </>
  );
};

export default Login;