import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Typography,
  Box,
  Paper
} from '@mui/material';
import { Close as CloseIcon, GetApp as DownloadIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';


const ImportUsers = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];
      setFile(uploadedFile);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
    }
  };
  
  const handleDownloadExample = () => {
    alert("Downloading example spreadsheet template");
  };
  
  const handleSave = () => {
    if (file) {
      alert(`File "${file.name}" would be processed and saved`);
      onClose();
    } else {
      alert("Please select a file first");
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Typography variant="h6">Importar Planilha de Usuários</Typography>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<DownloadIcon />}
            color="primary"
            onClick={handleDownloadExample}
          >
            Baixar modelo de planilha
          </Button>
        </Box>
        
        <Paper
          variant="outlined"
          sx={{
            border: '2px dashed',
            borderColor: isDragging ? 'primary.main' : 'divider',
            bgcolor: isDragging ? 'action.hover' : 'background.paper',
            p: 3,
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <UploadIcon fontSize="large" color="action" />
            <Typography variant="body1" fontWeight="medium">
              {file 
                ? `Arquivo selecionado: ${file.name}`
                : 'Arraste e solte ou clique para selecionar'}
            </Typography>
            {file && (
              <Button 
                size="small" 
                color="error" 
                onClick={handleClearFile}
                sx={{ mt: 1 }}
              >
                Limpar arquivo
              </Button>
            )}
            <Typography variant="body2" color="text.secondary">
              Formatos suportados: CSV, XLSX, XLS
            </Typography>
          </Box>
        </Paper>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ImportUsers.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImportUsers;