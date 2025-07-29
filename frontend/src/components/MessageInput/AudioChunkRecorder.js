import React, { useRef, useState } from "react";

// Componente para gravar e enviar áudio em chunks
const AudioChunkRecorder = ({ onChunkSend, onFinish }) => {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new window.MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current = mediaRecorder;
    setChunks([]);
    setRecording(true);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        onChunkSend(e.data);
        setChunks((prev) => [...prev, e.data]);
      }
    };
    mediaRecorder.onstop = () => {
      setRecording(false);
      onFinish(new Blob(chunks, { type: "audio/webm" }));
    };
    mediaRecorder.start(1000); // envia chunks a cada 1s
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div>
      {!recording ? (
        <button onClick={startRecording}>Gravar áudio (chunks)</button>
      ) : (
        <button onClick={stopRecording}>Parar gravação</button>
      )}
    </div>
  );
};

export default AudioChunkRecorder;
