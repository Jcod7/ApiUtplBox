const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedoresSnapshot = await db.collection('Proveedor').get();
    if (proveedoresSnapshot.empty) {
      return res.status(404).json({ message: 'No proveedores found' });
    }
    const proveedoresList = proveedoresSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(proveedoresList);
  } catch (error) {
    console.error('Error al obtener los proveedores:', error);
    return res.status(500).send('Error al obtener los proveedores');
  }
});

module.exports = router;
