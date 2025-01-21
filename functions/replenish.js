const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');


const serviceAccount = require('./authinventario.json'); 
admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount)
    }
  );


const db = firebaseAdmin.firestore();

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Ruta para recomponer un componente del inventario
app.put('/api/recomponer-componente/:id', async (req, res) => {
  try {
    const { id } = req.params; // El ID del componente a recomponer
    const { cantidadRecompuesta, descripcion } = req.body;

    // Validar los datos recibidos
    if (!cantidadRecompuesta || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos: cantidadRecompuesta y descripcion' });
    }

    // Referencia al componente en el inventario
    const componenteRef = db.collection('inventarios').doc(id);
    const doc = await componenteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }

    // Actualizar el estado y la cantidad del componente
    await componenteRef.update({
      cantidad: firebaseAdmin.firestore.FieldValue.increment(cantidadRecompuesta), // Aumentar la cantidad del componente
      estado: 'Recompuesto',
      descripcion,
      fechaRecomposicion: firebaseAdmin.firestore.FieldValue.serverTimestamp() // Agregar la fecha de recomposición
    });

    return res.status(200).json({ message: 'Componente recompuesto con éxito', id });
  } catch (error) {
    console.error("Error al recomponer componente: ", error);
    return res.status(500).json({ error: 'Error al recomponer componente' });
  }
});

// Ruta para obtener todos los componentes del inventario
app.get('/api/inventario', async (req, res) => {
  try {
    const inventarioRef = db.collection('inventarios');
    const snapshot = await inventarioRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron componentes en el inventario' });
    }

    // Mapear los documentos a un formato más legible
    const inventarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(inventarios);
  } catch (error) {
    console.error("Error al obtener inventario: ", error);
    return res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

// Ruta para obtener un componente específico por ID
app.get('/api/inventario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const componenteRef = db.collection('inventarios').doc(id);
    const doc = await componenteRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Componente no encontrado' });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error al obtener componente: ", error);
    return res.status(500).json({ error: 'Error al obtener componente' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Microservicio de recomposición de componentes escuchando en http://localhost:${port}`);
});