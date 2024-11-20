import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import resource from '../../api/requests/resource';
import Alert from '../../components/UseAlert';
import { useEffect, useState } from 'react';

const Invetory = () => {
  var [dataValues, setDataValues] = useState([]);
  const { renderAlerts, addAlert } = Alert();


  const getData = async () => {
    try {
      const { data } = await resource.getAll();
      console.log(data.content);
      setDataValues(data.content);
    } catch (error) {
      console.log(error);
      addAlert('Erro ao recuperar os dados!', 'error');
    }
  }
  
  const handleEdit = (id) => {
    console.log(`Editar recurso com ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Excluir recurso com ID: ${id}`);
  };

  useEffect(() => {
    getData();
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden p-4">
      {renderAlerts()}

      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
          sx={{ backgroundColor: '#007bff' }}
        >
          Cadastrar
        </Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome do Recurso</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataValues.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => handleEdit(row.id)}
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
    </div>
  );
};

export default Invetory;
