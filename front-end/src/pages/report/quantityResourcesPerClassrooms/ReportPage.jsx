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
    // Adiciona estilos específicos para impressão
    const printStyles = document.createElement('style');
    printStyles.innerHTML = `
      @media print {
        body.print-mode {
          margin: 0;
          padding: 0;
          overflow: visible !important;
        }
        
        body.print-mode * {
          overflow: visible !important;
        }
        
        .print-container {
          width: 100% !important;
          height: auto !important;
          overflow: visible !important;
          margin: 0 !important;
          padding: 15px !important;
        }
        
        .print-table {
          width: 100% !important;
          border-collapse: collapse !important;
          page-break-inside: avoid;
        }
        
        .print-table th,
        .print-table td {
          border: 1px solid #000 !important;
          padding: 8px !important;
          font-size: 12px !important;
          overflow: visible !important;
        }
        
        .print-table th {
          background-color: #f5f5f5 !important;
          font-weight: bold !important;
        }
        
        .print-table-row {
          page-break-inside: avoid;
        }
        
        .print-table-row:nth-child(15n) {
          page-break-after: always;
        }
        
        .print-header {
          font-size: 18px !important;
          font-weight: bold !important;
          margin-bottom: 20px !important;
          text-align: center !important;
        }
        
        .print-total {
          font-size: 14px !important;
          font-weight: bold !important;
          margin-top: 20px !important;
          text-align: right !important;
        }
        
        .no-print {
          display: none !important;
        }
        
        .resource-item {
          margin-bottom: 2px !important;
          font-size: 11px !important;
        }
        
        /* Remove margens e paddings desnecessários */
        .MuiPaper-root {
          box-shadow: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .MuiTableContainer-root {
          box-shadow: none !important;
          overflow: visible !important;
        }
        
        /* Força quebra de página em tabelas longas */
        .print-page-break {
          page-break-before: always;
        }
      }
    `;
    
    document.head.appendChild(printStyles);
    document.body.classList.add("print-mode");
    
    setTimeout(() => {
      window.print();
      document.body.classList.remove("print-mode");
      document.head.removeChild(printStyles);
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

  // Função para dividir as salas em chunks para melhor paginação
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const roomChunks = chunkArray(rooms, 12); // 12 salas por página

  return (
    <Scaffold appBarActions={appBarActions} reportTitle="Relatório de Recursos por Sala">
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
        <Paper sx={{ padding: 3, margin: 3 }} id="report-content">
          <div className="print-container">
            <Typography variant="h5" gutterBottom className="print-header">
              Relatório de Recursos por Sala
            </Typography>
            
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <>
                {roomChunks.map((chunk, chunkIndex) => (
                  <div key={chunkIndex} className={chunkIndex > 0 ? "print-page-break" : ""}>
                    <TableContainer component={Paper} className="print-table-container">
                      <Table className="print-table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Sala</TableCell>
                            <TableCell>Recursos</TableCell>
                            <TableCell>Quantidade Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {chunk.map((room) => (
                            <TableRow key={room.id} className="print-table-row">
                              <TableCell>{room.name}</TableCell>
                              <TableCell>
                                {room.idsResources.map((resource, resourceIndex) => (
                                  <div key={resourceIndex} className="resource-item">
                                    {resource.name}: {resource.quantity}
                                  </div>
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
                  </div>
                ))}
                
                <Typography variant="h6" sx={{ marginTop: 2 }} className="print-total">
                  Total de Recursos: {totalResources}
                </Typography>
              </>
            )}
          </div>
        </Paper>
      </div>
    </Scaffold>
  );
};

export default RoomResourcesReport;