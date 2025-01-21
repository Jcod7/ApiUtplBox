const admin = require('firebase-admin');
const express = require('express');
const app = express();


app.use(express.json());


app.get('/pedidos-con-componente', (req, res) => {
  res.send('¡Hola! Este es tu microservicio.');
});

// Crea una ruta para una API simple
app.get('/ComponentOrdersScreen/pedidos', (req, res) => {
  const nombre = req.query.nombre || 'Visitante';
  res.json({
    mensaje: `¡Hola, ${nombre}! Bienvenido al catálogo de pedidos.`,
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Microservicio corriendo en http://localhost:${PORT}`);
});