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

const Room = () => {
  const data = [
    { id: 1, roomName: 'Sala 101', capacity: 30, hasAV: true },
    { id: 2, roomName: 'Sala 102', capacity: 25, hasAV: false },
    { id: 3, roomName: 'Laboratório de Informática', capacity: 20, hasAV: true },
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

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome da Sala</TableCell>
            <TableCell>Capacidade</TableCell>
            <TableCell>Equipamento Audiovisual</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.roomName}</TableCell>
              <TableCell>{row.capacity}</TableCell>
              <TableCell>{row.hasAV ? 'Sim' : 'Não'}</TableCell>
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

export default Room;
