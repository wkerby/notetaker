//require fs
const fs = require('fs');

//establish connection with express package
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

//middleware that allows us to use all files located in public directory
app.use(express.static('public'));

//allow server to work with JSON data
app.use(express.json())

//allow server to work with url-encoded data
app.use(express.urlencoded({ extended: true }));

//set up GET route for home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

//set up GET route for /notes page

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});

//require the db.json file and save into variable 
const db = require('./db/db.json');

//create GET /api/notes endpoint that returns current notes data in json
app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    console.log(req.body);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    if (title && text) {
        //create a newNote object
        const newNote = {
            title,
            text
        };

        //Obtain existing notes
        fs.readFile(`./db/db.json`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                //Convert string into JSON object
                const parsedNotes = JSON.parse(data);
                //Push the new note
                parsedNotes.push(newNote);

                //Write updated notes back to the db.json file
                fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 4), (err) => {
                    err
                        ? console.error(err)
                        : console.info("Successfully updated notes!")
                });
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    }

    else {
        res.status(500).json('Error posting new note.');
    }
});



