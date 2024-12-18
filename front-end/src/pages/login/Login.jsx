import React, { useState } from 'react';
import { TextField, Button, Container, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/UseAlert';
import auth from '../../api/requests/auth';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { renderAlerts, addAlert } = Alert();
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        addAlert('Por favor, preencha todos os campos!', 'warning');
        return;
      }

      const request = {
        login: email,
        password: password
      };
      
      const { data } = await auth.login(request);

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

  return (
    <>
      <div className="flex items-center justify-center h-screen">
      {renderAlerts()}
        <Container maxWidth="sm" className="mt-10">
          <Paper elevation={3} className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
              <div>
                <FormControl fullWidth variant="outlined">
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
                          value={password}
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