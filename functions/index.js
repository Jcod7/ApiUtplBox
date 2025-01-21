const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors'); // Importar cors
import axios from 'axios';


const app = express();
const serviceAccount = require("./authinventario.json");
admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount)
  }
);

const db = admin.firestore();
app.use(cors()); // Permite solicitudes desde cualquier origen

app.get('/hello-world', (req, res) => {
  return res.status(200).json({ message: 'Hello world' });
});

//Solicitud a la API
const fetchData = async () => {
  try {
      const response = await axios.get('http://localhost:5000/api/data');
      setData(response.data);
  } catch (error) {
      console.error(error);
  }
};

app.get('/componentes', async (req, res) => {
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

app.get('/almacenes', async (req, res) => {
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

app.get('/auditorias', async (req, res) => {
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

app.get('/inventarios', async (req, res) => {
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

app.get('/pedidos', async (req, res) => {
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

app.get('/pedidos_componentes', async (req, res) => {
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

app.get('/proveedores', async (req, res) => {
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

app.get('/stock', async (req, res) => {
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

app.get('/usuarios', async (req, res) => {
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


app.get('/pedidos-con-componentes', async (req, res) => {
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

// agrega documentos a la colección Componente

app.put('/components', async (req, res) => {
  const componentsList = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    componentsList.forEach(component => {
      const docRef = db.collection('Componente').doc();
      batch.set(docRef, component);
    });
    await batch.commit();

    res.status(201).json({ message: 'Componentes actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar el componente:', error);
    res.status(500).json({ error: 'Error al actualizar el componente' });
  }
});

app.post('/almacen', async (req, res) => {
  const almacen = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    almacen.forEach(almacen => {
      const docRef = db.collection('Almacen').doc();
      batch.set(docRef, almacen);
    });

    await batch.commit();

    res.status(201).json({ message: 'Almacenes agregados correctamente' });
  } catch (error) {
    console.error('Error al acceder al almacen:', error);
    res.status(500).json({ error: 'Error al acceder al almacen' });
  }
});

app.post('/auditoria', async (req, res) => {
  const auditoria = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    auditoria.forEach(auditoria => {
      const docRef = db.collection('Auditoria').doc();
      batch.set(docRef, auditoria);
    });

    await batch.commit();

    res.status(201).json({ message: 'auditoria recuperada correctamente' });
  } catch (error) {
    console.error('Error al recuperar las auditorías:', error);
    res.status(500).json({ error: 'Error al recuperar las auditorías' });
  }
});

app.post('/inventario', async (req, res) => {
  const components = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    inventario.forEach(inventario => {
      const docRef = db.collection('Inventario').doc();
      batch.set(docRef, inventario);
    });

    await batch.commit();

    res.status(201).json({ message: 'Inventario recuperado correctamente' });
  } catch (error) {
    console.error('Error al recuperar el inventario:', error);
    res.status(500).json({ error: 'Error al recuperar el inventario' });
  }
});


exports.app = functions.https.onRequest(app);

app.post('/pedido', async (req, res) => {
  const pedidos = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    pedidos.forEach(pedido => {
      const docRef = db.collection('Pedido').doc();
      batch.set(docRef, pedido);
    });

    await batch.commit();

    res.status(201).json({ message: 'Pedidos recuperados correctamente' });
  } catch (error) {
    console.error('Error al consultar los pedidos:', error);
    res.status(500).json({ error: 'Error al consultar los pedidos' });
  }
});

app.post('/pedidos-con-componente', async (req, res) => {
  const pedidosConComponentes = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    pedidosConComponentes.forEach(component => {
      const docRef = db.collection('Pedido-Componente').doc();
      batch.set(docRef, component);
    });

    await batch.commit();

    res.status(201).json({ message: 'Consulta realizada correctamente' });
  } catch (error) {
    console.error('Error al realizar la consulta de los componentes:', error);
    res.status(500).json({ error: 'Error al realizar la consulta de los componentes' });
  }
});

app.post('/proveedor', async (req, res) => {
  const proveedores = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    proveedores.forEach(proveedor => {
      const docRef = db.collection('Proveedor').doc();
      batch.set(docRef, proveedor);
    });

    await batch.commit();

    res.status(201).json({ message: 'proveedores recuperados correctamente' });
  } catch (error) {
    console.error('Error al recuperar los proveedores:', error);
    res.status(500).json({ error: 'Error al recuperer los proveedores' });
  }
});

app.post('/stock', async (req, res) => {
  const stockList = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    stockList.forEach(stockSnapshot => {
      const docRef = db.collection('Stock').doc();
      batch.set(docRef, stockSnapshot);
    });

    await batch.commit();

    res.status(201).json({ message: 'Revisión de stock realizada correctamente' });
  } catch (error) {
    console.error('Error al realizar la revisión del stock:', error);
    res.status(500).json({ error: 'Error al realizar la revisión de stock' });
  }
});

app.post('/usuario', async (req, res) => {
  const usuariosList = req.body;
  // Validación (similar a tu código original)
  try {
    const batch = db.batch();

    usuariosList.forEach(usuariosSnapshot => {
      const docRef = db.collection('Usuario').doc();
      batch.set(docRef, usuariosSnapshot);
    });

    await batch.commit();

    res.status(201).json({ message: 'Usuarios recuperados correctamente' });
  } catch (error) {
    console.error('Error al recuperar los usuarios:', error);
    res.status(500).json({ error: 'Error al recuperar los usuarios' });
  }
});

app.delete('/inventarios', async (req, res) => {
  try{
    const document = db.collection('Inventario').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/componentes', async (req, res) => {
  try{
    const document = db.collection('Componente').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/almacen', async (req, res) => {
  try{
    const document = db.collection('Almacen').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/auditorias', async (req, res) => {
  try{
    const document = db.collection('Auditoria').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/pedidos', async (req, res) => {
  try{
    const document = db.collection('Pedido').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/pedidos-con-componente', async (req, res) => {
  try{
    const document = db.collection('Pedido').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/proveedores', async (req, res) => {
  try{
    const document = db.collection('Proveedor').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/stock', async (req, res) => {
  try{
    const document = db.collection('Stock').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});

app.delete('/usuarios', async (req, res) => {
  try{
    const document = db.collection('Usuario').doc(req.params.id)
    await document.delete()
    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
});


