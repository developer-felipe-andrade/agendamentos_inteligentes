import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { QrCode, Close } from "@mui/icons-material";
import whatsapp from "../../api/requests/whatsapp";

const WhatsAppQrModal = () => {
  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const fetchQrCode = async () => {
    try {
      const { data } = await whatsapp.qrCode();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error("Erro ao buscar QR Code:", error);
    }
  };

  const checkWhatsAppStatus = async () => {
    try {
      const { data } = await whatsapp.status();
      setIsConnected(data.connected);

      if (isConnected) {
        closeModal();
      }

      if (!data.connected) {
        setOpen(true);
        await fetchQrCode();
      } else {
        alert("O WhatsApp já está conectado!");
      }
    } catch (error) {
      console.error("Erro ao verificar status do WhatsApp:", error);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    if (!isConnected) {
      fetchQrCode();
      const interval = setInterval(fetchQrCode, 55000);
  
      return () => clearInterval(interval);
    }
  }, [open]);
  
  useEffect(() => {
    const interval = setInterval(fetchQrCode, 5000);
  
    if (isConnected) {
      closeModal();
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <>
      <ListItem onClick={checkWhatsAppStatus} button>
        <ListItemIcon>
          <QrCode />
        </ListItemIcon>
        <ListItemText primary="Confirmar WhatsApp" />
      </ListItem>

      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>
          Escaneie o QR Code
          <IconButton aria-label="close" onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center">
            <img src={qrCode} alt="QR Code" className="w-40 h-40" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WhatsAppQrModal;
