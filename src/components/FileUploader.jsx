
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { parseChat } from '../utils/parser';

const FileUploader = ({ onDataLoaded, onLoading }) => {
  const [error, setError] = useState(null);

  const processZipFile = useCallback(async (file) => {
    try {
      const zip = await JSZip.loadAsync(file);
      const txtFiles = [];

      // Filter for .txt files
      zip.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir &&
          relativePath.toLowerCase().endsWith('.txt') &&
          !relativePath.includes('__MACOSX') &&
          !relativePath.startsWith('.')) {
          txtFiles.push(zipEntry);
        }
      });

      if (txtFiles.length === 0) {
        throw new Error("No se encontraron archivos .txt en el ZIP.");
      }



      let allMessages = [];
      const failedFiles = [];
      let successCount = 0;

      for (const zipEntry of txtFiles) {
        try {
          // Security: check size logic could go here, but async("string") is usually safe enough for reasonable files
          const content = await zipEntry.async("string");
          const messages = parseChat(content);

          if (messages.length > 0) {
            allMessages = allMessages.concat(messages);
            successCount++;
          } else {
            console.warn(`Archivo ${zipEntry.name} analizado pero tenía 0 mensajes.`);
            failedFiles.push(zipEntry.name);
          }
        } catch (err) {
          console.warn(`Fallo al analizar ${zipEntry.name}`, err);
          failedFiles.push(zipEntry.name);
        }
      }

      if (allMessages.length === 0) {
        throw new Error("No se pudieron analizar mensajes de los archivos ZIP.");
      }

      // Show warnings for failed files
      if (failedFiles.length > 0) {
        const failedList = failedFiles.slice(0, 3).join(', ');
        const moreCount = failedFiles.length > 3 ? ` +${failedFiles.length - 3} más` : '';
        toast.error(`Fallo al cargar: ${failedList}${moreCount}`, { duration: 5000 });
      }

      if (onDataLoaded) onDataLoaded(allMessages, file.name);
      toast.success(`Cargados exitosamente ${successCount} archivos (${allMessages.length} mensajes)`);

    } catch (err) {
      console.error("Error ZIP:", err);
      const msg = err.message || "Fallo al procesar el archivo ZIP.";
      setError(msg);
      toast.error(msg);
    } finally {
      if (onLoading) onLoading(false);
    }
  }, [onDataLoaded, onLoading]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError(null);

    // Handle rejections
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      let errMsg = "Error verificando archivo.";
      if (rejection.errors[0].code === 'file-invalid-type') {
        errMsg = "Tipo de archivo inválido. Por favor sube un .txt o .zip.";
      }
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (onLoading) onLoading(true);

    // ZIP Handling
    if (file.name.endsWith('.zip')) {
      processZipFile(file);
      return;
    }

    // TXT Handling
    if (!file.name.endsWith('.txt')) {
      const errMsg = "Solo se permiten archivos .txt o .zip.";
      setError(errMsg);
      toast.error(errMsg);
      if (onLoading) onLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.onabort = () => toast.error('Lectura de archivo abortada');
    reader.onerror = () => {
      toast.error('Fallo al leer archivo');
      setError("Fallo al leer archivo.");
      if (onLoading) onLoading(false);
    };
    reader.onload = () => {
      const binaryStr = reader.result;
      // Parse data
      try {
        const messages = parseChat(binaryStr);
        if (messages.length === 0) {
          throw new Error("No se encontraron mensajes");
        }
        if (onDataLoaded) onDataLoaded(messages, file.name);
        toast.success(`Analizados correctamente ${messages.length} mensajes`);
      } catch (err) {
        console.error("Error de análisis", err);
        const errMsg = "No se pudo analizar el chat. Asegúrate de que es una exportación válida de WhatsApp.";
        setError(errMsg);
        toast.error(errMsg);
      } finally {
        if (onLoading) onLoading(false);
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, [onDataLoaded, onLoading, processZipFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="uploader-container">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''}`}>
        <input {...getInputProps()} />

        {error ? (
          <AlertCircle size={64} color="#ef4444" />
        ) : (
          <UploadCloud size={64} color={isDragActive ? '#25D366' : '#888'} />
        )}

        {error ? (
          <div className="error-msg">
            <p>Error: {error}</p>
            <small>Haz clic para intentar de nuevo</small>
          </div>
        ) : (
          isDragActive ?
            <p>Suelta el archivo aquí ...</p> :
            <p>Arrastra y suelta tu chat de WhatsApp (.txt o .zip) aquí</p>
        )}

        {!error && <small className="hint">Acepta archivos .txt y .zip</small>}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // Randomly distributed messages over 6 months to ensure quarters and months data
            const sampleMessages = [
              { date: '1/1/24', time: '10:00', author: 'Alice', content: 'Hola', timestamp: new Date('2024-01-01T10:00:00') },
              { date: '1/1/24', time: '10:01', author: 'Bob', content: 'Que tal', timestamp: new Date('2024-01-01T10:01:00') },
              { date: '1/2/24', time: '10:05', author: 'Alice', content: 'Bien y tu?', timestamp: new Date('2024-02-01T10:05:00') },
              { date: '1/3/24', time: '12:00', author: 'Bob', content: 'Todo bien jaja', timestamp: new Date('2024-03-01T12:00:00') },
              { date: '1/4/24', time: '13:00', author: 'Alice', content: 'Me alegro', timestamp: new Date('2024-04-01T13:00:00') },
              { date: '1/5/24', time: '09:00', author: 'Bob', content: 'imagen omitida', timestamp: new Date('2024-05-02T09:00:00') },
              { date: '1/6/24', time: '09:05', author: 'Alice', content: 'Jaja lol', timestamp: new Date('2024-06-02T09:05:00') },
            ];
            if (onDataLoaded) onDataLoaded(sampleMessages, "Chat de Ejemplo (Debug)");
          }}
          style={{
            padding: '0.5rem 1rem',
            background: '#4a4a4a',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🐛 Cargar Ejemplo (Debug)
        </button>
      </div>

      <div className="how-to-guide">
        <h3>Cómo exportar tu chat</h3>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <p>Abre el chat y toca el nombre o menú</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <p>Selecciona <b>Más</b> &gt; <b>Exportar Chat</b></p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <p>Elige la opción </p><p><b>"Sin Archivos"</b></p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <p>Guárdalo como archivo en tu dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
