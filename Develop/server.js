//establish connection with express package
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

//middleware that allows us to use all files located in public directory
app.use(express.static('public'));

//set up GET route for home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});