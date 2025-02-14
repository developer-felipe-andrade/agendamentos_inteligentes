import { useState } from "react";
import PropTypes from "prop-types";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Print, ZoomIn, ZoomOut } from "@mui/icons-material";
import Scaffold from "../../../components/Scaffold"; 

const ReportViewer = ({ reportTitle, reportContent, reservations, footerContent }) => {
  const [zoom, setZoom] = useState(1);

  const approvedReservations = reservations.filter(res => res.status === "APPROVED");
  const pendingReservations = reservations.filter(res => res.status === "PENDING");

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
    { icon: <Print />, onClick: handlePrint }
  ];

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
    <Typography variant="h5" gutterBottom>{reportTitle}</Typography>
    <div>{reportContent}</div>
    
    <Table className="print:w-full">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Data Início</TableCell>
          <TableCell>Data Fim</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {approvedReservations.map((res) => (
          <TableRow key={res.id}>
            <TableCell>{res.id}</TableCell>
            <TableCell>{res.dtStart}</TableCell>
            <TableCell>{res.dtEnd}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {/* Tabela de Reservas Pendentes */}
    <Typography variant="h6" sx={{ marginTop: 2 }}>Reservas Pendentes</Typography>
    <TableContainer component={Paper} className="print:w-full">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Data Início</TableCell>
            <TableCell>Data Fim</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingReservations.map((res) => (
            <TableRow key={res.id}>
              <TableCell>{res.id}</TableCell>
              <TableCell>{res.dtStart}</TableCell>
              <TableCell>{res.dtEnd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</div>


        {footerContent && (
          <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%", textAlign: "center", padding: "10px 0", backgroundColor: "#f1f1f1" }}>
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
      dtStart: PropTypes.string.isRequired,
      dtEnd: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  footerContent: PropTypes.string,
};

export default ReportViewer;
