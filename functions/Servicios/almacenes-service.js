const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener los almacenes
router.get('/', async (req, res) => {
  try {
    const almacenesSnapshot = await db.collection('Almacen').get();
    if (almacenesSnapshot.empty) {
      return res.status(404).json({ message: 'No almacenes found' });
    }
    const almacenesList = almacenesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(almacenesList);
  } catch (error) {
    console.error('Error al obtener los almacenes:', error);
    return res.status(500).send('Error al obtener los almacenes');
  }
});

module.exports = router;
