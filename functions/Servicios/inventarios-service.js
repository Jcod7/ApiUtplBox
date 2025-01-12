const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener los inventarios
router.get('/', async (req, res) => {
  try {
    const inventariosSnapshot = await db.collection('Inventario').get();
    if (inventariosSnapshot.empty) {
      return res.status(404).json({ message: 'No inventarios found' });
    }
    const inventariosList = inventariosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(inventariosList);
  } catch (error) {
    console.error('Error al obtener los inventarios:', error);
    return res.status(500).send('Error al obtener los inventarios');
  }
});

module.exports = router;
