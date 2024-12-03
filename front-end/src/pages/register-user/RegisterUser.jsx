import auth from '../../api/requests/auth'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Paper, TextField, Container, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from '../../components/UseAlert';

const RegisterUser = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [role, setRole] = useState('');
  const { renderAlerts, addAlert } = Alert();


  const navigate = useNavigate();

  const handleSubmit = async () => {
    const request = {
      name: name,
      login: email,
      password: password,
      role: role
    }

    try {
      await auth.register(request);
      
      handleLogin();
      addAlert('Cadastro efetuado com sucesso!', 'success');
    } catch (error) {
      addAlert(error, 'error');
    }
  };
  
  const handleLogin = () => {
    navigate('/');
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {renderAlerts()}
      <Container maxWidth="sm" className="mt-10">
        <Paper elevation={3} className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar</h2>
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
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            </div>
            
            <div>
              <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="role-select-label">Selecione o Cargo</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={role}
                    onChange={handleChange}
                    label="Selecione o Cargo"
                  >
                    <MenuItem value="ADMIN">Administrador</MenuItem>
                    <MenuItem value="COORDINATED">Coordenador</MenuItem>
                    <MenuItem value="USER">Usuário</MenuItem>
                  </Select>
                </FormControl>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                className="w-full bg-blue-500 text-white"
              >
                Solicitar cadastro
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
}

export default RegisterUser