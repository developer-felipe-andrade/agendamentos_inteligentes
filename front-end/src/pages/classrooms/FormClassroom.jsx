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
	const [formData, setFormData] = useState({id: '', name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true, idUser: "", idsResources: [] });
  const [users, setUsers] = useState([]);
  const { renderAlerts, addAlert } = Alert();
	const { id } = useParams();
	const [dataResource, setDataResources] = useState([{
		name: '',
		type: '',
		quantity: 0
	}]);
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
	
	const handleQuantityChange = (index, value) => {
		const updatedResources = [...formData.idsResources];
		updatedResources[index].quantity = value || 0; 
		setFormData({ ...formData, idsResources: updatedResources });
	};

	const handleSave = async () => {
    try {
      await Classroom.create(formData);
      addAlert('Sala salva com sucesso!', 'success');
    } catch (error) {
      console.log(error);
      addAlert('Erro ao salvar a sala', 'error');
    } finally {
			navigate(-1);
		}
  };

	const getDataResources = async () => {
    try {
      const { data } = await Resource.getAll();
      const formatDataResource = data.content.map(resource => {
				const matchResource = formData.idsResources.find(item => item.id === resource.id);
				if (matchResource) {
					return { ...resource, quantity: matchResource.quantity};
				}

				return resource;
			})

			setDataResources(formatDataResource);
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

	const getClassroomById = async (id) => {
    const { data } = await Classroom.findById(id);
    
    setFormData({
			id: data.id,
      name: data.name,
      qtdPlace: data.qtdPlace,
      block: data.block,
      acessible: data.acessible,
      active: data.active,
      confirmation: data.confirmation,
      idUser: data.responsible?.id,
			idsResources: data.idsResources
    });
  }

	useEffect(() => {
		const fetchClassroom = async () => {
			if (id) {
				await getClassroomById(id);
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

	useEffect(() => {
		const fetchDataResources = async () => {
			await getDataResources(); 
		};
		fetchDataResources();
	}, [formData.idsResources]);

	const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
	<div className="h-screen w-screen overflow-hidden">
		<Scaffold>
			{renderAlerts()}
			<h2 className="text-2xl font-bold">Cadastrar Sala</h2>
			<form onSubmit={handleSave}>
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
					sx={{ flex: 1 }} // Flexibilidade para os campos
				/>
				<TextField
					margin="normal"
					label="Bloco"
					name="block"
					fullWidth
					required
					value={formData.block}
					onChange={handleChange}
					sx={{ flex: 1 }} // Flexibilidade para os campos
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
					<Table stickyHeader>
						<TableHead>
						<TableRow>
							<TableCell>Nome</TableCell>
							<TableCell>Tipo</TableCell>
							<TableCell>Quantidade</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
							{dataResource.map((row, index) => (
								<TableRow key={index}>
									<TableCell className="w-1/3">{row.name}</TableCell>
									<TableCell className="w-1/3">{row.type}</TableCell>
									<TableCell className="w-1/3">
										<TextField
											className="xs:w-[50px] sm:w-[300px]"
											value={row.quantity || 0} // Garantir que o valor não seja undefined
											onChange={(e) => handleQuantityChange(index, e.target.value)}
											onBlur={(e) => validateQuantity(index, e.target.value)}
											error={!!errorQuantities[index]}
											helperText={errorQuantities[index]}
											variant="outlined"
											size="small"
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<div className="flex justify-end gap-4 mt-4">
					<Button onClick={() => navigate(-1)} color="secondary" variant="outlined">
						Cancelar
					</Button>
					<Button type="submit" variant="contained" color="primary" disabled={validateForm()}>
						Salvar
					</Button>
				</div>
			</form>
		</Scaffold>
	</div>
  );
};

export default FormClassroom;