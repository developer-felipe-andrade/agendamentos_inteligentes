import { useState, useEffect } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Print, ZoomIn, ZoomOut } from "@mui/icons-material";
import Scaffold from "../../../components/Scaffold";
import classroom from "../../../api/requests/classrooms";

const RoomResourcesReport = () => {
  const [zoom, setZoom] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await classroom.findAll();
      setRooms(response.data.content);
    } catch (error) {
      console.error("Erro ao buscar salas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    document.body.classList.add("print-mode");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-mode");
    }, 500);
  };

  const appBarActions = [
    { icon: <ZoomIn />, onClick: () => setZoom(zoom + 0.1) },
    { icon: <ZoomOut />, onClick: () => setZoom(Math.max(0.5, zoom - 0.1)) },
    { icon: <Print />, onClick: handlePrint },
  ];

  const totalResources = rooms.reduce((acc, room) => {
    return acc + room.idsResources.reduce((sum, resource) => sum + resource.quantity, 0);
  }, 0);

  return (
    <Scaffold appBarActions={appBarActions} reportTitle="Relatório de Recursos por Sala">
      <div className="report-container print:w-full" style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
        <Paper sx={{ padding: 3, margin: 3 }} id="report-content" className="print:m-0 print:p-0 print:shadow-none">
          <Typography variant="h5" gutterBottom>Relatório de Recursos por Sala</Typography>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <TableContainer component={Paper} className="print:w-full">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sala</TableCell>
                    <TableCell>Recursos</TableCell>
                    <TableCell>Quantidade Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.name}</TableCell>
                      <TableCell>
                        {room.idsResources.map((resource, index) => (
                          <div key={index}>Recurso {resource.id}: {resource.quantity}</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {room.idsResources.reduce((sum, resource) => sum + resource.quantity, 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Typography variant="h6" sx={{ marginTop: 2 }}>Total de Recursos: {totalResources}</Typography>
        </Paper>
      </div>
    </Scaffold>
  );
};

export default RoomResourcesReport;
