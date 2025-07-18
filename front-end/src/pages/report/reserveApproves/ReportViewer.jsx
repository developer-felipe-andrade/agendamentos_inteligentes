import { useState } from "react";
import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Print, ZoomIn, ZoomOut } from "@mui/icons-material";
import Scaffold from "../../../components/Scaffold"; 
import { format, parseISO } from "date-fns";

const ReportViewer = ({ reportTitle, reportContent, reservations, footerContent }) => {
  const [zoom, setZoom] = useState(1);

  const approvedReservations = reservations.filter(res => res.status === "APPROVED");
  const pendingReservations = reservations.filter(res => res.status === "PENDING");

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
        
        .print-section {
          page-break-inside: avoid;
          margin-bottom: 20px !important;
        }
        
        .print-section-title {
          font-size: 16px !important;
          font-weight: bold !important;
          margin-bottom: 10px !important;
          margin-top: 20px !important;
        }
        
        .print-header {
          font-size: 18px !important;
          font-weight: bold !important;
          margin-bottom: 20px !important;
          text-align: center !important;
        }
        
        .print-content {
          font-size: 14px !important;
          margin-bottom: 20px !important;
        }
        
        .print-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          text-align: center;
          padding: 10px 0;
          background-color: #f1f1f1 !important;
          font-size: 12px !important;
        }
        
        .no-print {
          display: none !important;
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
        
        /* Força quebra de página entre seções se necessário */
        .print-approved-section {
          page-break-after: auto;
        }
        
        .print-pending-section {
          page-break-before: auto;
        }
        
        /* Quebra de página a cada 15 linhas */
        .print-table-row:nth-child(15n) {
          page-break-after: always;
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
    { icon: <Print />, onClick: handlePrint }
  ];

  // Função para dividir as reservas em chunks para melhor paginação
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const approvedChunks = chunkArray(approvedReservations, 12);
  const pendingChunks = chunkArray(pendingReservations, 12);

  return (
    <Scaffold
      appBarActions={appBarActions}
      reportTitle={reportTitle}
    >
      <div
        className="report-container print:w-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
      >
        <Paper sx={{ padding: 3, margin: 3 }} id="report-content" className="print:m-0 print:p-0 print:shadow-none">
          <div className="print-container">
            <Typography variant="h5" gutterBottom className="print-header">
              {reportTitle}
            </Typography>
            
            <div className="print-content">
              {reportContent}
            </div>
            
            {/* Seção de Reservas Aprovadas */}
            <div className="print-section print-approved-section">
              <Typography variant="h6" className="print-section-title">
                Reservas Aprovadas
              </Typography>
              
              {approvedChunks.map((chunk, chunkIndex) => (
                <div key={`approved-${chunkIndex}`} className={chunkIndex > 0 ? "print-page-break" : ""}>
                  <TableContainer component={Paper} className="print-table-container">
                    <Table className="print-table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Título</TableCell>
                          <TableCell>Sala de aula</TableCell>
                          <TableCell>Data Início</TableCell>
                          <TableCell>Data Fim</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {chunk.map((res) => (
                          <TableRow key={res.id} className="print-table-row">
                            <TableCell>{res.title}</TableCell>
                            <TableCell>{res.classroom.name}</TableCell>
                            <TableCell>{format(parseISO(res.dtStart), "dd/MM/yyyy hh:mm")}</TableCell>
                            <TableCell>{format(parseISO(res.dtEnd), "dd/MM/yyyy hh:mm")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              ))}
            </div>

            {/* Seção de Reservas Pendentes */}
            {pendingReservations.length > 0 && (
              <div className="print-section print-pending-section">
                <Typography variant="h6" className="print-section-title">
                  Reservas Pendentes
                </Typography>
                
                {pendingChunks.map((chunk, chunkIndex) => (
                  <div key={`pending-${chunkIndex}`} className={chunkIndex > 0 ? "print-page-break" : ""}>
                    <TableContainer component={Paper} className="print-table-container">
                      <Table className="print-table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Sala de aula</TableCell>
                            <TableCell>Data início</TableCell>
                            <TableCell>Data fim</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {chunk.map((res) => (
                            <TableRow key={res.id} className="print-table-row">
                              <TableCell>{res.title}</TableCell>
                              <TableCell>{res.classroom.name}</TableCell>
                              <TableCell>{format(parseISO(res.dtStart), "dd/MM/yyyy hh:mm")}</TableCell>
                              <TableCell>{format(parseISO(res.dtEnd), "dd/MM/yyyy hh:mm")}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Paper>
      </div>

      {footerContent && (
        <div className="print-footer">
          <Typography>{footerContent}</Typography>
        </div>
      )}
    </Scaffold>
  );
};

ReportViewer.propTypes = {
  reportTitle: PropTypes.string.isRequired,
  reportContent: PropTypes.string.isRequired,
  reservations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      dtStart: PropTypes.string.isRequired,
      dtEnd: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  footerContent: PropTypes.string,
};

export default ReportViewer;