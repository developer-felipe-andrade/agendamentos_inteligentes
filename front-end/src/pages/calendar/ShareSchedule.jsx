import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

// eslint-disable-next-line react/prop-types
const ShareSchedule = ({ selectedRoom }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const link = `http://localhost:5173/reserve/${selectedRoom}`;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        disabled={!selectedRoom} 
        onClick={openModal} 
        variant="contained" 
        color="primary"
      >
        Compartilhar agenda
      </Button>
      
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Compartilhar Agenda</DialogTitle>
        <DialogContent className="flex justify-center items-center">
          <QRCode value={link} size={200} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ShareSchedule;
