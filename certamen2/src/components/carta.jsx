import React from 'react';
import { motion } from 'framer-motion';

function Carta({ palo, valor, onDescartar, id }) {
  const simbolosPalo = {
    'corazon': '♥',
    'diamante': '♦',
    'trebol': '♣',
    'pica': '♠'
  };

  const colorPalo = {
    'corazon': '#dc3545',
    'diamante': '#dc3545',
    'trebol': '#000',
    'pica': '#000'
  };

  return (
    <motion.div
      className="carta"
      layout
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, rotate: 180 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      style={{
        border: '2px solid #333',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#fff',
        position: 'relative',
        width: '100px',
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      <motion.button 
        className="btn-eliminar"
        onClick={() => onDescartar(id)}
        aria-label="Descartar carta"
        whileHover={{ scale: 1.3, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '25px',
          height: '25px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        X
      </motion.button>

      <div 
        className="carta-valor" 
        style={{ 
          fontSize: '28px', 
          fontWeight: 'bold',
          color: colorPalo[palo]
        }}
      >
        {valor}
      </div>
      <div 
        style={{ 
          fontSize: '40px',
          color: colorPalo[palo]
        }}
      >
        {simbolosPalo[palo]}
      </div>
    </motion.div>
  );
}

export default Carta;