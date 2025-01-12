// src/servicios/usuarios-service.js
const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener los usuarios
router.get('/', async (req, res) => {
  try {
    const usuariosSnapshot = await db.collection('Usuario').get();
    if (usuariosSnapshot.empty) {
      return res.status(404).json({ message: 'No usuarios found' });
    }
    const usuariosList = usuariosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(usuariosList);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return res.status(500).send('Error al obtener los usuarios');
  }
});

module.exports = router;

