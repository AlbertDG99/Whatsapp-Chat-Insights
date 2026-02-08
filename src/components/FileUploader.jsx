
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import JSZip from 'jszip';
import { parseChat } from '../utils/parser';
import PrivacyBadge from './common/PrivacyBadge';
import styles from './FileUploader.module.css';

const FileUploader = ({ onDataLoaded, onLoading }) => {
  const [error, setError] = useState(null);

  const processZipFile = useCallback(async (file) => {
    const loadingToast = toast.loading('Procesando archivo ZIP...');
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

      toast.loading(`Analizando ${txtFiles.length} archivo(s)...`, { id: loadingToast });

      let allMessages = [];
      const failedFiles = [];
      let successCount = 0;

      for (const zipEntry of txtFiles) {
        try {
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

      toast.dismiss(loadingToast);
      if (onDataLoaded) onDataLoaded(allMessages, file.name);
      toast.success(`Cargados exitosamente ${successCount} archivos (${allMessages.length} mensajes)`);

    } catch (err) {
      toast.dismiss(loadingToast);
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
      } else if (rejection.errors[0].code === 'file-too-large') {
        errMsg = "El archivo es demasiado grande. El tamaño máximo es 100 MB.";
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

    const isLargeFile = file.size > 5 * 1024 * 1024;
    let loadingToast = null;
    if (isLargeFile) {
      loadingToast = toast.loading('Procesando archivo...');
    }

    const reader = new FileReader();
    reader.onabort = () => {
      if (loadingToast) toast.dismiss(loadingToast);
      toast.error('Lectura de archivo abortada');
    };
    reader.onerror = () => {
      if (loadingToast) toast.dismiss(loadingToast);
      toast.error('Fallo al leer archivo');
      setError("Fallo al leer archivo.");
      if (onLoading) onLoading(false);
    };
    reader.onload = () => {
      if (loadingToast) toast.dismiss(loadingToast);
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
        let errMsg;
        if (err.message === 'No se encontraron mensajes') {
          errMsg = 'No se detectaron mensajes. Verifica que el archivo es una exportación de WhatsApp con formato "fecha - autor: mensaje". Exporta "Sin archivos".';
        } else {
          errMsg = 'Error inesperado al analizar el archivo. Verifica que no está dañado.';
        }
        setError(errMsg);
        toast.error(errMsg, { duration: 6000 });
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
    multiple: false,
    maxSize: 100 * 1024 * 1024
  });

  return (
    <div className={styles.container}>
      <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${error ? 'error' : ''}`}>
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

      <PrivacyBadge />

      <div className={styles.howToGuide}>
        <h3 className={styles.sectionTitle}>Cómo exportar tu chat</h3>
        <div className={styles.stepsGrid}>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>1</div>
            <p>Abre el chat y toca el nombre o menú</p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>2</div>
            <p>Selecciona <b>Más</b> &gt; <b>Exportar Chat</b></p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>3</div>
            <p>Elige la opción </p><p><b>"Sin Archivos"</b></p>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNumber}>4</div>
            <p>Guárdalo como archivo en tu dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
