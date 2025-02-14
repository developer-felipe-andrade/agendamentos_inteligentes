import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ReportViewer from "./ReportViewer";
import { useNavigate } from "react-router-dom";
import reservation from "../../../api/requests/reservation";

const ReportPage = () => {
  const navigate = useNavigate();

  const today = dayjs();
  const firstDayOfMonth = dayjs().startOf("month");

  const [openDialog, setOpenDialog] = useState(true);
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [showReport, setShowReport] = useState(false);
  const [reservationsData, setReservationsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showReport) {
      fetchReservations();
    }
  }, [showReport]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.dtStart = startDate.format("YYYY-MM-DD");
      if (endDate) params.dtEnd = endDate.format("YYYY-MM-DD");

      const response = await reservation.findAll(params);
      setReservationsData(response.data.content);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setShowReport(true);
    setOpenDialog(false);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const approvedCount = reservationsData.filter((res) => res.status === "APPROVED").length;
  const pendingCount = reservationsData.filter((res) => res.status === "PENDING").length;
  const totalCount = reservationsData.length;

  const footerContent = `Reservas Aprovadas: ${approvedCount} | Reservas Pendentes: ${pendingCount} | Total: ${totalCount}`;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Selecionar Período do Relatório</DialogTitle>
        <DialogContent>
          <DatePicker
            label="Data Inicial"
            value={startDate}
            onChange={setStartDate}
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            clearable
          />
          <DatePicker
            label="Data Final"
            value={endDate}
            onChange={setEndDate}
            format="DD/MM/YYYY"
            slotProps={{ textField: { fullWidth: true, margin: "dense" } }}
            clearable
          />
        </DialogContent>
        <DialogActions>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button onClick={handleClear} color="default">
              Limpar
            </Button>
            <Box>
              <Button onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} color="primary" variant="contained">
                Gerar Relatório
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>

      {loading && <p>Carregando...</p>}

      {showReport && !loading && (
        <ReportViewer 
          reportTitle={`Relatório de Reservas (${startDate ? startDate.format("DD/MM/YYYY") : "Todas"} - ${endDate ? endDate.format("DD/MM/YYYY") : "Todas"})`} 
          reportContent=""
          reservations={reservationsData} 
          footerContent={footerContent} 
        />
      )}
    </LocalizationProvider>
  );
};

export default ReportPage;
