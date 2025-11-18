import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Carta from './carta';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfing';

function Mano() {
  const [cartas, setCartas] = useState([]);
  const [valor, setValor] = useState('');
  const [pinta, setPinta] = useState('corazon');
  const [resultado, setResultado] = useState('');
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const pintas = [
    { value: 'corazon', label: 'Corazón ♥' },
    { value: 'diamante', label: 'Diamante ♦' },
    { value: 'trebol', label: 'Trébol ♣' },
    { value: 'pica', label: 'Pica ♠' }
  ];

  const valoresPosibles = [
    { value: 1, label: 'A' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' },
    { value: 11, label: 'J' },
    { value: 12, label: 'Q' },
    { value: 13, label: 'K' }
  ];

  const obtenerValorVisual = (num) => {
    if (num === 1) return 'A';
    if (num === 11) return 'J';
    if (num === 12) return 'Q';
    if (num === 13) return 'K';
    return num;
  };

  const agregarCarta = () => {
    const valorNum = parseInt(valor);
    
    if (!valor || isNaN(valorNum)) {
      alert('Seleccione un valor de carta');
      return;
    }

    const nuevaCarta = {
      id: Date.now(),
      valor: valorNum,
      pinta: pinta
    };

    setCartas([...cartas, nuevaCarta]);
    setValor('');
    setMostrarResultado(false);
  };

  const descartarCarta = (id) => {
    setCartas(cartas.filter(carta => carta.id !== id));
    setMostrarResultado(false);
  };

  const ordenarCartas = () => {
    const ordenadas = [...cartas].sort((a, b) => {
      if (a.valor !== b.valor) {
        return a.valor - b.valor;
      }
      return a.pinta.localeCompare(b.pinta);
    });
    setCartas(ordenadas);
  };

  const validarTrio = (grupo) => {
    if (grupo.length !== 3) return false;
    return grupo.every(carta => carta.valor === grupo[0].valor);
  };

  const validarEscalera = (grupo) => {
    if (grupo.length < 3) return false;
    
    const mismaPinta = grupo.every(carta => carta.pinta === grupo[0].pinta);
    if (!mismaPinta) return false;

    const ordenadas = [...grupo].sort((a, b) => a.valor - b.valor);
    
    for (let i = 1; i < ordenadas.length; i++) {
      if (ordenadas[i].valor !== ordenadas[i-1].valor + 1) {
        return false;
      }
    }
    return true;
  };

  const validarJuegoCompleto = () => {
    if (cartas.length < 9) return false; 

    const combinaciones = [];
    
    const generarCombinaciones = (cartasRestantes, gruposActuales) => {
      if (cartasRestantes.length === 0) {
        combinaciones.push([...gruposActuales]);
        return;
      }

      for (let size = 3; size <= cartasRestantes.length; size++) {
        for (let i = 0; i <= cartasRestantes.length - size; i++) {
          const grupo = cartasRestantes.slice(i, i + size);
          const resto = [...cartasRestantes.slice(0, i), ...cartasRestantes.slice(i + size)];
          
          if (validarEscalera(grupo) || validarTrio(grupo)) {
            generarCombinaciones(resto, [...gruposActuales, grupo]);
          }
        }
      }
    };

    generarCombinaciones(cartas, []);

    for (const combinacion of combinaciones) {
      let escaleras = 0;
      let trios = 0;

      for (const grupo of combinacion) {
        if (validarEscalera(grupo)) escaleras++;
        if (validarTrio(grupo)) trios++;
      }

      if (escaleras === 2 && trios === 1) {
        return true;
      }
    }

    return false;
  };

  const validarJuego = async () => {
    setMostrarResultado(false);

    if (cartas.length < 9) {
      setResultado('NO FORMA JUEGO :C');
      setMostrarResultado(true);
      return;
    }

    if (validarJuegoCompleto()) {
      setResultado('¡JUEGO VÁLIDO! (2 Escaleras + 1 Trío)');
      setMostrarResultado(true);
      await guardarJugada();
    } else {
      setResultado('NO FORMA JUEGO :C');
      setMostrarResultado(true);
    }
  };

  const guardarJugada = async () => {
    try {
      const jugada = {
        cartas: cartas.map(c => ({
          numero: obtenerValorVisual(c.valor),
          pinta: c.pinta
        })),
      };

      await addDoc(collection(db, 'jugadascarioca'), jugada);
      console.log('Jugada guardada exitosamente en Firebase');
    } catch (error) {
      console.error('Error al guardar jugada:', error);
      alert('Error al guardar la jugada en Firebase');
    }
  };

  return (
    <div className="container mt-5">
      <motion.h1 
        className="text-center mb-4"
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ color: '#2c3e50', fontWeight: 'bold' }}
      >
        Juego de Carioca
      </motion.h1>

      <motion.div 
        className="card p-4 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ backgroundColor: '#f8f9fa', border: '2px solid #dee2e6' }}
      >
        <h4 className="mb-3">Agregar Carta</h4>
        <p className="text-muted mb-3">Objetivo: <strong>2 Escaleras + 1 Trío</strong></p>
        <div className="row g-3">
          <div className="col-md-4">
            <select
              className="form-select"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            >
              <option value="">Seleccione Valor</option>
              {valoresPosibles.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select 
              className="form-select"
              value={pinta}
              onChange={(e) => setPinta(e.target.value)}
            >
              {pintas.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <motion.button
              className="btn btn-primary w-100"
              onClick={agregarCarta}
              whileHover={{ scale: 1.05, backgroundColor: '#0056b3' }}
              whileTap={{ scale: 0.95 }}
              style={{ fontWeight: 'bold' }}
            >
              Agregar Carta
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="mb-4">
        <motion.button
          className="btn btn-success me-2"
          onClick={validarJuego}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontWeight: 'bold' }}
        >
          Validar Juego
        </motion.button>
        <motion.button
          className="btn btn-info"
          onClick={ordenarCartas}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontWeight: 'bold' }}
        >
          Ordenar Cartas
        </motion.button>
      </div>

      <AnimatePresence>
        {mostrarResultado && (
          <motion.h1
            className={`text-center mb-4 ${
              resultado.includes('VÁLIDO') ? 'text-success' : 'text-danger'
            }`}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              duration: 0.6
            }}
            style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}
          >
            {resultado}
          </motion.h1>
        )}
      </AnimatePresence>

      <div className="d-flex flex-wrap gap-3 justify-content-center">
        <AnimatePresence>
          {cartas.map((carta) => (
            <Carta
              key={carta.id}
              id={carta.id}
              valor={obtenerValorVisual(carta.valor)} 
              palo={carta.pinta} 
              onDescartar={descartarCarta}
            />
          ))}
        </AnimatePresence>
      </div>

      {cartas.length === 0 && (
        <motion.div
          className="text-center text-muted mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h4>No hay cartas. ¡Comienza a agregar cartas!</h4>
          <p>Necesitas formar: <strong>2 Escaleras</strong> y <strong>1 Trío</strong></p>
        </motion.div>
      )}
    </div>
  );
}

export default Mano;