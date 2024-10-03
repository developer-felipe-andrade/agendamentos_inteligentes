import { useState } from 'react';
import { TextField, Button, Container, Paper, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const navigate = useNavigate();

  const handleLogin = () => {
    window.alert(`email: ${email} / senha: ${password}`);
  };

  const handleForgotPassword = () => {
    navigate('/esqueceu-senha');
  };

  return (
    <div className="flex items-center justify-center h-screen">
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
              <Box mt={2} display="flex" justifyContent="flex-end">
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
  );
};

export default Login;
