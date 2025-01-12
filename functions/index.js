const functions = require('firebase-functions');
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const { db } = require('./config.js');  // Importar la configuración de Firebase
const cors = require('cors'); // Importar cors

const app = express();
app.use(cors()); // Permite solicitudes desde cualquier origen

// Importar los microservicios
const componentesService = require('./servicios/componentes-service.js');
const almacenesService = require('./servicios/almacenes-service.js');
const auditoriasService = require('./servicios/auditorias-service.js');
const inventariosService = require('./servicios/inventarios-service.js');
const pedidosService = require('./servicios/pedidos-service.js');
const proveedoresService = require('./servicios/proveedores-service.js');
const stockService = require('./servicios/stock-service.js');
const usuariosService = require('./servicios/usuarios-service.js');

// Microservicios
app.use('/componentes', componentesService);
app.use('/almacenes', almacenesService);
app.use('/auditorias', auditoriasService);
app.use('/inventarios', inventariosService);
app.use('/pedidos', pedidosService);
app.use('/proveedores', proveedoresService);
app.use('/stock', stockService);
app.use('/usuarios', usuariosService);

// Exportar la función de Firebase
exports.app = functions.https.onRequest(app);
