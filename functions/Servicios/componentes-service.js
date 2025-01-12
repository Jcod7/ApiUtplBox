const express = require('express');
const { db } = require('d:/Descargas/ApiUtplBox-main/functions/config');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener los componentes
router.get('/', async (req, res) => {
  try {
    const componentsSnapshot = await db.collection('Componente').get();
    if (componentsSnapshot.empty) {
      return res.status(404).json({ message: 'No components found' });
    }
    const componentsList = componentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(componentsList);
  } catch (error) {
    console.error('Error al obtener los componentes:', error);
    return res.status(500).send('Error al obtener los componentes');
  }
});

// Ruta POST para agregar nuevos componentes
router.post('/', async (req, res) => {
  const components = req.body;
  try {
    const batch = db.batch();
    components.forEach(component => {
      const docRef = db.collection('Componente').doc();
      batch.set(docRef, component);
    });
    await batch.commit();
    res.status(201).json({ message: 'Componentes agregados correctamente' });
  } catch (error) {
    console.error('Error al agregar los componentes:', error);
    res.status(500).json({ error: 'Error al agregar los componentes' });
  }
});

module.exports = router;


