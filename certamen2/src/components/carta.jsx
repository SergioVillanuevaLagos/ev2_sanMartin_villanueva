import React from 'react';
import { motion } from 'framer-motion';

function Carta({ pinta, numero, onDescartar, id }) {
  const simbolosPinta = {
    'corazon': '♥',
    'diamante': '♦',
    'trebol': '♣',
    'pica': '♠'
  };

  return (
    <motion.div
      className="carta"
      layout
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0, rotate: 180 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      <motion.button 
        className="btn-eliminar"
        onClick={() => onDescartar(id)}
        aria-label="Descartar carta"
        whileHover={{ scale: 1.3, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        X
      </motion.button>

      <div 
        className={`carta-valor ${pinta}-color`}
      >
        {numero}
      </div>
      <div 
        className={`carta-simbolo ${pinta}-color`}
      >
        {simbolosPinta[pinta]}
      </div>
    </motion.div>
  );
}

export default Carta;