const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener el stock
router.get('/', async (req, res) => {
  try {
    const stockSnapshot = await db.collection('Stock').get();
    if (stockSnapshot.empty) {
      return res.status(404).json({ message: 'No stock found' });
    }
    const stockList = stockSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(stockList);
  } catch (error) {
    console.error('Error al obtener el stock:', error);
    return res.status(500).send('Error al obtener el stock');
  }
});

module.exports = router;
