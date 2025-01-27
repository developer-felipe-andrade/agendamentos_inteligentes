import auth from '../../api/requests/auth'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Paper, TextField, Container, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Select, MenuItem } from "@mui/material";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Alert from '../../components/UseAlert';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    email: '', 
    name: '', 
    password: '', 
    role: '', 
    profession: '',
    phoneNumber: ''
  });
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { renderAlerts, addAlert } = Alert();

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    
    if (email && !validateEmail(email)) {
      setEmailError('E-mail inválido');
    } else {
      setEmailError('');
    }
  };

  const isFormValid = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    const { phoneNumber, ...fieldsToValidate } = formData;
  
    return (
      Object.values(fieldsToValidate).every(value => value.trim() !== '') &&
      validateEmail(formData.email) &&
      !emailError
    );
  }, [formData, emailError]);
  

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = numbers;
    if (numbers.length > 0) {
      formatted = `(${numbers.slice(0,2)}`;
      if (numbers.length > 2) {
        formatted += `) ${numbers.slice(2,7)}`;
        if (numbers.length > 7) {
          formatted += `-${numbers.slice(7,11)}`;
        }
      }
    }
    return formatted;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    const numbersOnly = value.replace(/\D/g, '');
    if (numbersOnly.length <= 11) {
      const formatted = formatPhone(value);
      setFormData({ ...formData, phoneNumber: formatted });
    }
  };

  const handlePhoneValidate = () => {
    const numbersOnly = formData.phoneNumber.replace(/\D/g, "");
    if (numbersOnly.length !== 11 && numbersOnly.length > 0) {
      setPhoneError('Whatsapp inválido');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async () => {
    if (!validateEmail(formData.email)) {
      addAlert('Por favor, insira um e-mail válido', 'error');
      return;
    }

    const request = {
      name: formData.email,
      login: formData.email,
      password: formData.password,
      role: formData.role,
      profession: formData.profession,
      phoneNumber: formData.phoneNumber
    }

    try {
      await auth.register(request);
      addAlert('Cadastro efetuado com sucesso!', 'success');
      handleLogin();
    } catch (error) {
      console.log(error);
      addAlert('Ocorreu um erro ao realizar o cadastro. Tente novamente mais tarde.', 'error');
    }
  };
  
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div 
      className="flex items-center justify-center h-screen"
      onKeyDown={(e) => e.key === 'Enter' && isFormValid && handleSubmit()}
    >
      {renderAlerts()}
      <Container maxWidth="md" className="mt-10">
        <Paper elevation={3} className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Cadastrar</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="E-mail"
                variant="outlined"
                fullWidth
                required
                value={formData.email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <TextField
                label="Whatsapp"
                variant="outlined"
                fullWidth
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                onBlur={handlePhoneValidate}
                placeholder="(XX) XXXXX-XXXX"
                inputProps={{
                  maxLength: 15
                }}
                error={!!phoneError}
                helperText={phoneError}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth variant="outlined" required>
                <InputLabel id="role-select-label">Selecione o Cargo</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Selecione o cargo"
                >
                  <MenuItem value="ADMIN">Administrador</MenuItem>
                  <MenuItem value="COORDINATOR">Coordenador</MenuItem>
                  <MenuItem value="USER">Usuário</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" required>
                <InputLabel id="profession-select-label">Papel na faculdade</InputLabel>
                <Select
                  labelId="profession-select-label"
                  id="profession-select"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  label="Papel na faculdade"
                >
                  <MenuItem value="WORKER">Aluno</MenuItem>
                  <MenuItem value="STUDENT">Servidor</MenuItem>
                  <MenuItem value="EXTERNAL_COMUNITY">Comunidade Externa</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                className="w-full bg-blue-500 text-white"
                disabled={!isFormValid}
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