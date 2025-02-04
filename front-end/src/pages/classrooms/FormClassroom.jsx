import {
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
	Box,
	Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Classroom from '../../api/requests/classrooms'
import Alert from '../../components/UseAlert';
import Scaffold from "../../components/Scaffold";
import User from '../../api/requests/user';
import Resource from '../../api/requests/resource';

const FormClassroom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '', name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true, idUser: "", idsResources: [{
      name: '',
      type: '',
      quantity: 0
    }]
  });
  const [users, setUsers] = useState([]);
  const { renderAlerts, addAlert } = Alert();
  const { id } = useParams();
  const [dataResource, setDataResources] = useState([]);
  const [errorQuantities, setErrorQuantities] = useState({});

  const validateForm = () => {
    if (!formData.name || !formData.qtdPlace || !formData.block) {
      return true;
    }

    if (formData.confirmation && !formData.idUser) {
      return true;
    }

    if (formData.idsResources) {
      const filteredQuantity = formData.idsResources.filter(resource => resource.quantity > 0);
      if (filteredQuantity.length === 0) {
        return true;
      }
    }

    return false;
  };

  const validateQuantity = (index, value) => {
    if (value < 0 && value) {
      setErrorQuantities((prevErrors) => ({
        ...prevErrors,
        [index]: 'A quantidade não pode ser menor ou igual a zero.',
      }));
    } else {
      setErrorQuantities((prevErrors) => {
        // eslint-disable-next-line no-unused-vars
        const { [index]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleQuantityChange = (id, value) => {
		// Encontre o índice do recurso com o ID correspondente em formData.idsResources
		const updatedResources = [...formData.idsResources];
		const resourceIndex = updatedResources.findIndex((resource) => resource.id === id);
	
		if (resourceIndex >= 0) {
			updatedResources[resourceIndex].quantity = value;
	
			// Atualize o formData com a nova quantidade
			setFormData((prevFormData) => ({
				...prevFormData,
				idsResources: updatedResources,
			}));
		} else {
			console.error("Recurso não encontrado para o ID:", id);
		}
	
		const updatedDataResource = [...dataResource];
		const dataResourceIndex = updatedDataResource.findIndex((resource) => resource.id === id);
	
		if (dataResourceIndex >= 0) {
			updatedDataResource[dataResourceIndex].quantity = value;
			setDataResources(updatedDataResource);
		} else {
			console.error("Recurso não encontrado para o ID no dataResource:", id);
		}
	
		// Validar a quantidade
		setErrorQuantities((prevErrors) => {
			const updatedErrors = { ...prevErrors };
			if (value <= 0) {
				updatedErrors[id] = 'A quantidade não pode ser menor ou igual a zero.';
			} else {
				delete updatedErrors[id];
			}
			return updatedErrors;
		});
	};
	
  const handleSave = async () => {
    try {
      const data = { ...formData, idsResources: dataResource.filter(idResource => idResource.quantity > 0) };

      if (data.id) {
        await Classroom.update(data, data.id);
      } else {
        await Classroom.create(data);
      }
      addAlert('Sala salva com sucesso!', 'success');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao salvar a sala', 'error');
    } finally {
      navigate(-1);
    }
  };

  const getClassroomById = async (id) => {
		await getDataResources(); 
	
		const { data } = await Classroom.findById(id);
	
		// Atualizando formData com os dados da sala
		setFormData({
			id: data.id,
			name: data.name,
			qtdPlace: data.qtdPlace,
			block: data.block,
			acessible: data.acessible,
			active: data.active,
			confirmation: data.confirmation,
			idUser: data.responsible?.id,
			idsResources: data.idsResources || [] // Adicionando um fallback vazio, caso `idsResources` não exista
		});
	
		// Agora que os recursos foram carregados, atualizar os recursos com os valores de quantity da sala
		setDataResources(prevDataResource => 
			prevDataResource.map(resource => {
				const matchedResource = data.idsResources.find(r => r.id === resource.id);
				if (matchedResource) {
					return { ...resource, quantity: matchedResource.quantity };
				}
				return resource;
			})
		);
	};
	
	const getDataResources = async () => {
		try {
			const { data } = await Resource.getAll();
			setDataResources(data.content);
		} catch (error) {
			console.log(error);
			addAlert('Erro ao recuperar os dados!', 'error');
		}
	};
	

  const getUserResponsibles = async () => {
    try {
      const { data } = await User.responsibles();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  };

  useEffect(() => {
    const fetchClassroom = async () => {
      if (id) {
        await getClassroomById(id);
      } else {
				await getDataResources();
			}
    };
    fetchClassroom();
  }, [id]);

  useEffect(() => {
    const fetchUserResponsibles = async () => {
      if (formData.confirmation) {
        await getUserResponsibles();
      }
    };
    fetchUserResponsibles();
  }, [formData.confirmation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Scaffold>
        {renderAlerts()}
        <h2 className="text-2xl font-bold">Cadastrar Sala</h2>

        <div style={{ display: 'flex', gap: '16px' }}>
          <TextField
            margin="normal"
            label="Nome"
            name="name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
          <TextField
            margin="normal"
            label="Quantidade"
            name="qtdPlace"
            fullWidth
            required
            type="number"
            inputProps={{ min: 1 }}
            value={formData.qtdPlace}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
          <TextField
            margin="normal"
            label="Bloco"
            name="block"
            fullWidth
            required
            value={formData.block}
            onChange={handleChange}
            sx={{ flex: 1 }}
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              name="acessible"
              checked={formData.acessible}
              onChange={(e) =>
                setFormData({ ...formData, acessible: e.target.checked })
              }
              color="primary"
            />
          }
          label="É acessível para pessoas com modalidade reduzida?"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              color="primary"
            />
          }
          label="Ativo"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="confirmation"
              checked={formData.confirmation}
              onChange={(e) =>
                setFormData({ ...formData, confirmation: e.target.checked })
              }
              color="primary"
            />
          }
          label="Precisa de confirmação?"
        />
        {formData.confirmation && (
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="responsible-select-field">
              Selecione o responsável
            </InputLabel>
            <Select
              labelId="responsible-select-field"
              id="role-select"
              value={formData.idUser}
              onChange={(e) =>
                setFormData({ ...formData, idUser: e.target.value })
              }
              label="Selecione o responsável"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Divider></Divider>

        <TableContainer component={Paper} sx={{
					maxHeight: 'calc(100vh - 400px)',
					overflowY: 'auto',
					'@media (max-width: 600px)': {
						maxHeight: 'calc(100vh - 450px)',
					},
				}}>
					{dataResource.length === 0 ? (
						<Box sx={{ textAlign: 'center', padding: 2 }}>
							<Typography variant="h6" gutterBottom>
								Necessário cadastrar ao menos um recurso para a sala.
							</Typography>
							<Button 
								variant="contained" 
								color="primary" 
								onClick={() => navigate('/resources')}
							>
								Ir até a tela de recursos.
							</Button>
						</Box>
					) : (
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<TableCell>Nome</TableCell>
									<TableCell>Tipo</TableCell>
									<TableCell>Quantidade</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dataResource.map((row) => (
									<TableRow key={row.id}>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.type}</TableCell>
										<TableCell>
											<TextField
												value={row.quantity !== undefined ? row.quantity : 0} // Garantir que quantity tenha valor
												onChange={(e) => handleQuantityChange(row.id, e.target.value)}
												onBlur={(e) => validateQuantity(row.id, e.target.value)}
												error={!!errorQuantities[row.id]}
												helperText={errorQuantities[row.id]}
												variant="outlined"
												size="small"
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</TableContainer>
				
        <div className="flex justify-end gap-4 mt-4" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: 'white' }}>
					<Button onClick={() => navigate(-1)} color="secondary" variant="outlined">
						Cancelar
					</Button>
					<Button type="submit" variant="contained" color="primary" disabled={validateForm()} onClick={handleSave}>
						Salvar
					</Button>
				</div>
      </Scaffold>
    </div>
  );
};

export default FormClassroom;
