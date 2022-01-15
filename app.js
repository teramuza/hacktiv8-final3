const express = require('express');
const app = express();
const router = require('./controllers');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache')
    next()
})

app.use('/api/v1', router);
// NOTE: if you want to add a new controller, please add it in the 'controllers' directory, and list the router in 'controllers/index.js'

const port = process.env.PORT || process.env.APP_PORT

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
