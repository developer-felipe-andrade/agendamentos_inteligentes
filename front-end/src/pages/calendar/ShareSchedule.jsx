import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

// eslint-disable-next-line react/prop-types
const ShareSchedule = ({ selectedRoom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qrRef = useRef(null);

  const link = `http://localhost:5173/reserve/${selectedRoom}`;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    if (qrRef.current) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Imprimir QR Code</title></head><body>');
      printWindow.document.write('<h2>Compartilhar Agenda</h2>');
      printWindow.document.write(qrRef.current.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error('Erro ao copiar o link', err);
    }
  };

  return (
    <div>
      <Button disabled={!selectedRoom} onClick={openModal} variant="contained" color="primary">
        Compartilhar agenda
      </Button>
      
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Compartilhar Agenda</DialogTitle>
        <DialogContent className="flex flex-col justify-center items-center">
          <div ref={qrRef} className="p-4">
            <QRCode value={link} size={200} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopy} color="secondary">
            Copiar Link
          </Button>
          <Button onClick={handlePrint} color="primary">
            Imprimir
          </Button>
          <Button onClick={closeModal} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShareSchedule;
