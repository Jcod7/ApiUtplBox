const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener las auditorías
router.get('/', async (req, res) => {
  try {
    const auditoriasSnapshot = await db.collection('Auditoria').get();
    if (auditoriasSnapshot.empty) {
      return res.status(404).json({ message: 'No auditorias found' });
    }
    const auditoriasList = auditoriasSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(auditoriasList);
  } catch (error) {
    console.error('Error al obtener las auditorías:', error);
    return res.status(500).send('Error al obtener las auditorías');
  }
});

module.exports = router;
