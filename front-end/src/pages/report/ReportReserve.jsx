import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import { useReactToPrint } from 'react-to-print';

const ReportComponent = () => {
  const [zoom, setZoom] = useState(1);
  const reportRef = useRef();  // Ref do conteúdo que será impresso

  // Hook useReactToPrint configurado corretamente
  const handlePrint = useReactToPrint({
    content: () => reportRef.current,  // Passando a função corretamente
  });

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2)); // Limite máximo de zoom de 2x
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5)); // Limite mínimo de zoom de 0.5x
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório Exemplo", 20, 20);
    doc.text("Aqui vai o conteúdo do relatório.", 20, 30);
    doc.save('relatorio.pdf');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button onClick={handleZoomIn} className="px-4 py-2 bg-blue-500 text-white rounded">
            Zoom +
          </button>
          <button onClick={handleZoomOut} className="px-4 py-2 bg-blue-500 text-white rounded">
            Zoom -
          </button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-500 text-white rounded">
            Baixar PDF
          </button>
          <button onClick={handlePrint} className="px-4 py-2 bg-yellow-500 text-white rounded">
            Imprimir
          </button>
        </div>
      </div>
      
      <div 
        ref={reportRef}  // Aplicando a ref ao conteúdo do relatório
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }} 
        className="border p-4"
      >
        <h1 className="text-2xl font-bold mb-4">Relatório de Exemplo</h1>
        <p>Este conteúdo deve ser impresso. Verifique se o `reportRef` está correto!</p>
      </div>
    </div>
  );
};

export default ReportComponent;
