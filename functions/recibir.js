const admin = require('firebase-admin');
const express = require('express');
const app = express();


app.use(express.json());


app.get('/pedido', (req, res) => {
  res.send('¡Hola! Este es tu microservicio.');
});

// Crea una ruta para una API simple
app.get('/ComponentOrdersScreen/pedidos', (req, res) => {
  const nombre = req.query.nombre || 'Visitante';
  res.json({
    mensaje: `¡Hola, ${nombre}! Bienvenido al catálogo de pedidos.`,
  });
});

function obtenerInventario() {
  db.collection("Inventario")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    })
    .catch((error) => {
      console.log("Error obteniendo los productos: ", error);
    });
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Microservicio corriendo en http://localhost:${PORT}`);
});
