const admin = require('firebase-admin');
const serviceAccount = require('./authinventario.json'); // Ajusta la ruta según la estructura de tu proyecto

// Inicializa Firebase Admin si aún no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Exporta las instancias para usarlas en los microservicios
const db = admin.firestore();
module.exports = { admin, db };
