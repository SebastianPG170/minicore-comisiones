const path = require('path');
const express = require('express');
const comisionRoutes = require('./routes/comision.routes');

const app = express();

// Motor de vistas (V de MVC)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas -> Controlador
app.use('/', comisionRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('error', { titulo: '404', mensaje: 'Página no encontrada' });
});

// Errores no controlados
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { titulo: '500', mensaje: 'Error interno del servidor' });
});

module.exports = app;
