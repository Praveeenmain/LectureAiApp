import React, { useState, useRef, useEffect } from 'react';

const agentId = 'Geography-3v1N_N2-8eug6RzodGZQU';
const apiKey = 'ak-233a2aca335b4e5984e8960fcdce16bc';
const wsUrl = `wss://api.play.ai/v1/talk/${agentId}`;

const VoiceAIComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (isConnected) {
      wsRef.current = new WebSocket(wsUrl);

       // mulaw 16KHz as input
//{ "type": "setup", "apiKey": "...", "inputEncoding": "mulaw", "inputSampleRate": 16000 }
// 24Khz mp3 output
// { "type": "setup", "apiKey": "...", "outputFormat": "mp3", "outputSampleRate": 24000 }
// mulaw 8KHz in and out
// { "type": "setup", "apiKey": "...", "inputEncoding": "mulaw", "inputSampleRate": 8000, "outputFormat": "mulaw", "outputSampleRate": 8000 }



      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        wsRef.current.send(JSON.stringify({ type: "setup", apiKey: apiKey, outputFormat: "raw", outputSampleRate: 24000  }));
        console.log('Setup message sent');
      };

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('RECIEVED MESSAGE:', message);
   
        switch (message.type) {
          case 'voiceActivityStart':
            // Handle voice activity start (e.g., pause audio playback)
            console.log('Voice activity started');
            break;
          case 'voiceActivityEnd':
            // Handle voice activity end (e.g., resume audio playback)
            console.log('Voice activity ended');
            break;
          case 'audioStream':
            // Handle audio stream message (e.g., play the audio)
            handleAudioStream(message.data);
            break;
          case 'error':
            // Handle error message
            console.error('Error from server:', message.message);
            setError(message.message);
            break;
          default:
            console.warn('Unhandled message type:', message.type);
            break;
        }
       };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket error occurred.');
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
      };
    }
  }, [isConnected]);

  const handleStartRecording = async () => {
    if (!isConnected) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        const base64Data = await blobToBase64(event.data);
        wsRef.current.send(JSON.stringify({ type: 'audioIn', data: base64Data }));
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Failed to start recording.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioStream = async (base64Data) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
      },
    });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = async (event) => {
      const base64Data = await blobToBase64(event.data);
    
      // Relevant:
      wsRef.send(JSON.stringify({ type: 'audioIn', data: base64Data }));
    };
    
    async function blobToBase64(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
      });
    }
    
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  return (
    <div className="voice-ai-container">
      <h2>Voice AI Interaction</h2>
      <div className="controls">
        {!isConnected && (
          <button className="connect-button" onClick={() => setIsConnected(true)}>
            Connect
          </button>
        )}
        {isConnected && (
          <>
            <button
              className={`start-button ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              disabled={!isConnected}
            >
              {isRecording ? 'Stop' : 'Start'} Recording
            </button>
          </>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default VoiceAIComponent;
