import React, { useState, useEffect } from 'react';

// Reemplaza esta URL con la de tu Realtime Database de Firebase cuando la tengas
const FIREBASE_URL = "https://TU-PROYECTO.firebaseio.com/progresos";

const ExpressionBuilder = () => {
  const [studentName, setStudentName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const exercises = [
    { phrase: "El doble de un número", answer: "2x", explanation: "Doble = multiplicar por 2." },
    { phrase: "Un número aumentado en 7", answer: "x+7", explanation: "Aumentado = sumar (+)." },
    { phrase: "La mitad de un número menos 3", answer: "x/2-3", explanation: "Mitad = dividir entre 2." },
    { phrase: "El cuadrado de un número más 5", answer: "x^2+5", explanation: "Cuadrado = potencia 2 (^2)." },
    { phrase: "Tres veces un número disminuido en 8", answer: "3x-8", explanation: "Disminuido = restar (-)." },
    { phrase: "La suma de un número y su triple", answer: "x+3x", explanation: "Triple = 3 veces el número." },
    { phrase: "El producto de 5 y un número, menos 2", answer: "5x-2", explanation: "Producto = multiplicación." },
    { phrase: "El cociente de un número entre 4, más 6", answer: "x/4+6", explanation: "Cociente = división (/)." }
  ];

  const syncToCloud = async (step, status) => {
    if (!studentName || FIREBASE_URL.includes("TU-PROYECTO")) return;
    
    const data = {
      nombre: studentName,
      ejercicioActual: step + 1,
      totalCompletados: completed.length,
      estado: status,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(`${FIREBASE_URL}/${studentName.replace(/\s/g, '_')}.json`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch (e) { console.error("Error de sincronización:", e); }
  };

  const checkAnswer = () => {
    const current = exercises[currentExercise];
    const userClean = userAnswer.replace(/\s/g, '').toLowerCase().replace('²', '^2');
    const correctClean = current.answer.replace(/\s/g, '').toLowerCase().replace('²', '^2');
    
    if (userClean === correctClean) {
      setFeedback({ type: 'success', message: '¡Excelente! ' + current.explanation });
      const newCompleted = [...completed, currentExercise];
      setCompleted(newCompleted);
      
      syncToCloud(currentExercise, newCompleted.length === exercises.length ? "COMPLETADO" : "EN PROGRESO");

      if (newCompleted.length === exercises.length) {
        setTimeout(() => setIsFinished(true), 1500);
      }
    } else {
      setFeedback({ type: 'error', message: 'La expresión no coincide. ¡Inténtalo de nuevo!' });
    }
  };

  if (!isStarted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '20px', fontFamily: 'system-ui' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', marginBottom: '10px' }}>Constructor de Expresiones Algebraicas</h1>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Ingresa tu nombre para registrar tu progreso en la nube.</p>
          <input 
            type="text" 
            placeholder="Tu nombre completo" 
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', marginBottom: '20px', fontSize: '16px', outline: 'none' }}
          />
          <button 
            disabled={!studentName}
            onClick={() => { setIsStarted(true); syncToCloud(0, "INICIÓ"); }}
            style={{ width: '100%', background: studentName ? '#6366f1' : '#cbd5e1', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}
          >
            COMENZAR LABORATORIO
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#10b981', fontFamily: 'system-ui' }}>
        <div style={{ background: 'white', padding: '50px', borderRadius: '30px', textAlign: 'center', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🏆</div>
          <h2 style={{ fontSize: '28px', color: '#1e293b' }}>¡Felicidades, {studentName}!</h2>
          <p style={{ color: '#64748b' }}>Has completado todos los ejercicios con éxito.</p>
          <p style={{ fontSize: '14px', background: '#f1f5f9', padding: '10px', borderRadius: '8px', marginTop: '20px' }}>Tu reporte ha sido enviado al sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <div style={{ background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '16px', color: '#6366f1' }}>Constructor de Expresiones Algebraicas</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '13px', fontWeight: 'bold' }}>
            <span>Estudiante: {studentName}</span>
            <span>Progreso: {completed.length}/{exercises.length}</span>
          </div>
        </div>

        <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Traduce la frase:</p>
          <h2 style={{ textAlign: 'center', fontSize: '26px', margin: '20px 0 40px 0', color: '#1e293b' }}>"{exercises[currentExercise].phrase}"</h2>
          
          <input 
            type="text" 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="Escribe la expresión aquí..."
            style={{ width: '100%', padding: '20px', fontSize: '24px', textAlign: 'center', borderRadius: '15px', border: '3px solid #f1f5f9', background: '#f8fafc', marginBottom: '25px', outline: 'none', fontFamily: 'monospace' }}
          />
          
          <button onClick={checkAnswer} style={{ width: '100%', background: '#6366f1', color: 'white', padding: '18px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            VERIFICAR RESPUESTA
          </button>

          {feedback && (
            <div style={{ marginTop: '25px', padding: '20px', borderRadius: '15px', background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2', border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`, textAlign: 'center' }}>
              <p style={{ margin: 0, color: feedback.type === 'success' ? '#065f46' : '#991b1b', fontWeight: 'bold' }}>{feedback.message}</p>
              {feedback.type === 'success' && currentExercise < exercises.length - 1 && (
                <button 
                  onClick={() => { setCurrentExercise(currentExercise + 1); setUserAnswer(''); setFeedback(null); }} 
                  style={{ marginTop: '15px', background: '#065f46', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Siguiente Ejercicio →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpressionBuilder;
