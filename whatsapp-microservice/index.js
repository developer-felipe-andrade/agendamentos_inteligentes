const express = require('express');
const { Client } = require('whatsapp-web.js');
const QRCode = require('qrcode'); // Para gerar imagem do QR Code
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

let qrCodeImage = null; // Armazena o QR Code como uma string Base64
let isConnected = false; // Indica se o WhatsApp está conectado

// Configuração do WhatsApp Web Client
const client = new Client();

client.on('qr', async qr => {
  console.log('Novo QR Code gerado!');

  // Gera uma imagem Base64 do QR Code
  qrCodeImage = await QRCode.toDataURL(qr);
  isConnected = false; // Define como desconectado até que o usuário escaneie o QR Code
});

client.on('ready', () => {
  console.log('WhatsApp conectado com sucesso!');
  isConnected = true; // Marca como conectado
  qrCodeImage = null; // Limpa o QR Code após a conexão
});

client.on('disconnected', () => {
  console.log('WhatsApp desconectado!');
  isConnected = false; // Marca como desconectado
});

// Inicialize o cliente do WhatsApp
client.initialize();

// Middleware para parsing de JSON
app.use(bodyParser.json());

// Rota para fornecer o QR Code (expiração de 60 segundos)
app.get('/qr-code', (req, res) => {
  if (!qrCodeImage) {
    return res.status(404).json({ error: 'QR Code não disponível. Tente novamente mais tarde.' });
  }

  res.status(200).json({ qrCode: qrCodeImage });
});

// Rota para verificar o status da conexão com o WhatsApp
app.get('/status', (req, res) => {
  res.json({ connected: isConnected });
});

// Rota para envio de mensagens
app.post('/send-message', async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ error: 'Número e mensagem são obrigatórios.' });
  }

  const whatsappNumber = `${number}@c.us`;

  try {
    await client.sendMessage(whatsappNumber, message);
    res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ success: false, error: 'Erro ao enviar mensagem.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Microserviço rodando em: http://localhost:${port}`);
});
