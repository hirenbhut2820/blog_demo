require('dotenv').config();
require('./models/db');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
const apiRouter = require('./routes/api');
app.use("/api/1", apiRouter);

// Image path for images.
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Angular path
app.use(express.static(path.join(__dirname, '../angular/dist/angular')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../angular/dist/angular/index.html'));
})

app.listen(PORT, ()=> console.log(`express running at ${PORT}`));