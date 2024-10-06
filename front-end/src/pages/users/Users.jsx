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

const Users = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 28 },
    { id: 2, name: 'Jane Smith', age: 34 },
    { id: 3, name: 'Sam Green', age: 22 },
  ];

  const handleEdit = (id) => {
    console.log(`Editar recurso com ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Excluir recurso com ID: ${id}`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden mt-2">
      <div className="flex justify-end mb-4">
        <Button
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}
        >
          Cadastrar
        </Button>
      </div>

      {/* Tabela */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Idade</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.age}</TableCell>
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

export default Users;
