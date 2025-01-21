// Importar las dependencias necesarias
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

app.use(bodyParser.json());


app.post('/api/solicitar-componente', async (req, res) => {
  try {
    const { nombre, componente, estado, imagen } = req.body;

    
    if (!nombre || !componente || !estado || !imagen) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Referencia a la colección de solicitudes en Firestore
    const solicitudesRef = db.collection('solicitudes');

    // Agregar la solicitud a la base de datos
    const docRef = await solicitudesRef.add({
      nombre,
      componente,
      estado,
      imagen,
      fechaSolicitud: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({ message: 'Solicitud registrada con éxito', id: docRef.id });
  } catch (error) {
    console.error("Error al agregar solicitud: ", error);
    return res.status(500).json({ error: 'Error al registrar solicitud' });
  }
});

// Ruta para obtener todas las solicitudes de componentes
app.get('/api/solicitudes', async (req, res) => {
  try {
    const solicitudesRef = db.collection('solicitudes');
    const snapshot = await solicitudesRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No se encontraron solicitudes' });
    }

    // Mapear los documentos a un formato más legible
    const solicitudes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes: ", error);
    return res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

// Ruta para obtener las solicitudes filtradas por estado
app.get('/api/solicitudes/estado', async (req, res) => {
  const { estado } = req.query;

  if (!estado) {
    return res.status(400).json({ error: 'Se debe especificar el estado para filtrar' });
  }

  try {
    const solicitudesRef = db.collection('solicitudes');
    const snapshot = await solicitudesRef.where('estado', '==', estado).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: `No se encontraron solicitudes con el estado: ${estado}` });
    }

    const solicitudes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error("Error al obtener solicitudes filtradas: ", error);
    return res.status(500).json({ error: 'Error al obtener solicitudes filtradas' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Microservicio de solicitudes de componentes escuchando en http://localhost:${port}`);
});
