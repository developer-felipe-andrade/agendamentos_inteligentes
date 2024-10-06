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

const Invetory = () => {
  const data = [
    { id: 1, resourceName: 'Projetor', quantity: 2, condition: 'Bom' },
    { id: 2, resourceName: 'Computador', quantity: 5, condition: 'Excelente' },
    { id: 3, resourceName: 'Quadro Branco', quantity: 1, condition: 'Usado' },
  ];

  const handleEdit = (id) => {
    console.log(`Editar recurso com ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Excluir recurso com ID: ${id}`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden p-4">
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
            <TableCell>Quantidade</TableCell>
            <TableCell>Condição</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.resourceName}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>{row.condition}</TableCell>
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
