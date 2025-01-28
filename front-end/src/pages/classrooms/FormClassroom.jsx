import {
  TextField,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Classroom from '../../api/requests/classrooms'
import Alert from '../../components/UseAlert';
import Scaffold from "../../components/Scaffold";
import User from '../../api/requests/user';


const FormClassroom = () => {
  const navigate = useNavigate();
	const [formData, setFormData] = useState({ name: '', qtdPlace: '', block: "", acessible: true, active: true, confirmation: true, idUser: "" });
  const [users, setUsers] = useState([]);
  const { renderAlerts, addAlert } = Alert();
	const { id } = useParams();

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

	useEffect(() => {
    if (formData.confirmation) {
      const fetchData = async () => {
        try {
          const { data } = await User.responsibles();
          setUsers(data); 
        } catch (error) {
          console.error('Erro ao buscar dados da API:', error);
        }
      };
  
      fetchData();
    }
  }, [formData.confirmation]);

	const getClassroomById = async (id) => {
    const { data } = await Classroom.findById(id);
    
    setFormData({
      name: data.name,
      qtdPlace: data.qtdPlace,
      block: data.block,
      acessible: data.acessible,
      active: data.active,
      confirmation: data.confirmation,
      idUser: data.responsible?.id
    });
  }

	useEffect(() => {
    if (id) {
      getClassroomById(id);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  return (
		<div className="h-screen w-screen overflow-hidden">
			<Scaffold>
				{renderAlerts()}
				<h1 className="text-2xl font-bold mb-4">Cadastrar Sala</h1>
				<form onSubmit={handleSave}>
					<TextField
						margin="normal"
						label="Nome"
						name="name"
						fullWidth
						value={formData.name}
						onChange={handleChange}
					/>
					<TextField
						margin="normal"
						label="Quantidade"
						name="qtdPlace"
						fullWidth
						type="number"
						inputProps={{ min: 1 }}
						value={formData.qtdPlace}
						onChange={handleChange}
					/>
					<TextField
						margin="normal"
						label="Bloco"
						name="block"
						fullWidth
						value={formData.block}
						onChange={handleChange}
					/>
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
					<div className="flex justify-end gap-4 mt-4">
						<Button onClick={() => navigate(-1)} color="secondary" variant="outlined">
							Cancelar
						</Button>
						<Button type="submit" variant="contained" color="primary">
							Salvar
						</Button>
					</div>
				</form>
			</Scaffold>
		</div>
  );
};

export default FormClassroom;