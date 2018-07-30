'use strict';

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use('/feed', express.static('feedStatic'));
app.use('/connections', express.static('connectionsStatic'));

app.listen(process.env.PORT || 8080);

module.exports = { app };