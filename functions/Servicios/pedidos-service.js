const express = require('express');
const { db } = require('../config.js');  // Importa la configuración de Firebase
const router = express.Router();  // Usar Router para organizar rutas

// Ruta GET para obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const pedidosSnapshot = await db.collection('Pedido').get();
    if (pedidosSnapshot.empty) {
      return res.status(404).json({ message: 'No pedidos found' });
    }
    const pedidosList = pedidosSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(pedidosList);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    return res.status(500).send('Error al obtener los pedidos');
  }
});

// Ruta GET para obtener los componentes asociados a los pedidos
router.get('/componentes', async (req, res) => {
  try {
    const pedidosComponentesSnapshot = await db.collection('Pedido_Componente').get();
    if (pedidosComponentesSnapshot.empty) {
      return res.status(404).json({ message: 'No pedidos_componentes found' });
    }
    const pedidosComponentesList = pedidosComponentesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(pedidosComponentesList);
  } catch (error) {
    console.error('Error al obtener los pedidos componentes:', error);
    return res.status(500).send('Error al obtener los pedidos componentes');
  }
});

// Ruta GET para obtener los pedidos con sus componentes
router.get('/con-componentes', async (req, res) => {
  try {
    const pedidosComponentesSnapshot = await db.collection('Pedido_Componente').get();

    if (pedidosComponentesSnapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron pedidos asociados a componentes' });
    }

    const pedidosConComponentes = {};

    for (const doc of pedidosComponentesSnapshot.docs) {
      const { idPedido, codBarras } = doc.data();

      if (!pedidosConComponentes[idPedido]) {
        pedidosConComponentes[idPedido] = [];
      }

      const componenteSnapshot = await db.collection('Componente').where('codBarras', '==', codBarras).get();

      if (!componenteSnapshot.empty) {
        const componenteData = componenteSnapshot.docs[0].data();
        pedidosConComponentes[idPedido].push(componenteData);
      }
    }

    return res.status(200).json(pedidosConComponentes);
  } catch (error) {
    console.error('Error al obtener los pedidos con componentes:', error);
    return res.status(500).send('Error al obtener los pedidos con componentes');
  }
});

module.exports = router;
