const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-route');

const app = express();

app.use('/api/places', placesRoutes);

// app.use(bodyParser({extended:false}));

app.listen(5000);
