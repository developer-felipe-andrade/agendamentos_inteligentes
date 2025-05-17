import { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';
import { GetApp as DownloadIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import Alert from '../../components/UseAlert';
import user from '../../api/requests/user';

const ImportUsers = ({ open, onClose }) => {
  const { renderAlerts, addAlert } = Alert();

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    try {
      const fileUrl = '/example.xlsx';
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'modelo_importacao_usuarios.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addAlert("Download do modelo de planilha iniciado", 'success');
    } catch (error) {
      console.error('Erro ao baixar o modelo:', error);
      addAlert("Erro ao baixar o modelo de planilha", 'error');
    }
  };
  
  const handleSave = async () => {
    if (file) {
      try {
        setIsLoading(true);
        await user.importUsers(file);
        addAlert('Planilha de usuários importada com sucesso.', 'success');
        onClose();
      } catch (error) {
        console.error('Error importing users:', error);
        // Exibe mensagem de erro específica da API, se disponível
        const errorMessage = error.response?.data?.message || 'Erro ao importar planilha de usuários';
        addAlert(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }  
    } else {
      addAlert("Por favor, selecione um arquivo para importar", 'warning');
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      {renderAlerts()}

      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <Typography variant="h6">Importar Planilha de Usuários</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<DownloadIcon />}
            color="primary"
            onClick={handleDownloadExample}
            disabled={isLoading}
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
            cursor: isLoading ? 'default' : 'pointer',
            pointerEvents: isLoading ? 'none' : 'auto'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".xlsx"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {isLoading ? (
              <>
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body1" fontWeight="medium">
                  Processando importação...
                </Typography>
              </>
            ) : (
              <>
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
                  Formatos suportados: XLSX
                </Typography>
              </>
            )}
          </Box>
        </Paper>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!file || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? 'Importando...' : 'Importar'}
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