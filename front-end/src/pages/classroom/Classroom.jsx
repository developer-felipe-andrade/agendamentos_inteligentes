import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Api from '../../api/requests/classrooms'
import { useEffect, useState } from 'react';
import Alert from '../../components/UseAlert';
import ConfirmationModal from '../../components/ConfirmationModal';
import Scaffold from '../../components/Scaffold';
import { useNavigate } from 'react-router-dom';


const Classroom = () => {
  const [dataValues, setDataValues] = useState([]);
  const { renderAlerts, addAlert } = Alert();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setModalOpen(false)
  };
  
  const handleOpen = async (id) => {
    if (id) {
      navigate(`/classroom/${id}`)
      return;
    }

    navigate('/classroom');
  };

  const handleConfirm = async () => {
    try {
      await Api.delete(selectedId);
      
      getData();
      handleCloseModal();
      addAlert('Sala excluída com sucesso.', 'success');
    } catch (error) {
      console.log(error)
      addAlert('Erro ao deletar a sala', 'error');
    }
  };

  const getData = async () => {
    try {
      const { data } = await Api.getAll();
      
      setDataValues(data.content);
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  };

  const handleDelete = async (id) => {
    setModalOpen(true);
    setSelectedId(id);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ConfirmationModal
        open={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title="Excluir Sala"
        message="Você tem certeza que deseja excluir essa sala?"
      />

      <Scaffold>
        {renderAlerts()}
      
        <div className="flex justify-end mb-4">
          <Button
            variant="contained"
            color="primary"
            endIcon={<AddIcon />}
            onClick={() => handleOpen(null)}
          >
            Cadastrar
          </Button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Sala</TableCell>
              <TableCell>Bloco</TableCell>
              <TableCell>Capacidade de pessoas</TableCell>
              <TableCell>É acessível para pessoas com modalidade reduzida?</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataValues.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.block}</TableCell>
                <TableCell>{row.qtdPlace}</TableCell>
                <TableCell>{row.acessible ? 'Sim' : 'Não'}</TableCell>
                <TableCell>{row.active ? 'Ativo' : 'Inativo'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpen(row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scaffold>
    </div>
  );
};

export default Classroom;
