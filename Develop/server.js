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


//create GET /api/notes endpoint that returns current notes data in json
app.get('/api/notes', (req, res) => {
    let data = JSON.parse(fs.readFileSync('./db/db.json')); //reads the db.json file updated when POST or DELETE api route is called
    // fs.readFile('./db/db.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     else {
    //         res.json(JSON.parse(data));
    //     }
    // });
    res.json(data);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    console.log(req.body);

    // Destructuring assignment for the items in req.body
    const { title, text, id } = req.body;
    if (title && text) {
        //create a newNote object
        const newNote = {
            title,
            text,
            id
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
                fs.writeFileSync(`./db/db.json`, JSON.stringify(parsedNotes, null, 4), (err) => {
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

//create DELETE route
app.delete('/api/notes/:id', (req, res) => {
    const queryId = req.params.id;
    console.info(`${req.method} request received to delete note ${queryId}`);
    if (queryId) {
        let data = JSON.parse(fs.readFileSync('./db/db.json'));
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == queryId) {
                try {
                    data.splice(i, 1);//remove the object with matching ID from list of note objects
                }
                catch {
                    console.log("There was an error deleting note from JSON file")
                }
            }
        }

        fs.writeFileSync(`./db/db.json`, JSON.stringify(data, null, 4), (err) => {
            err
                ? console.error(err)
                : console.info("Successfully deleted note!")
        });
        console.log("Finished re-writing the file!")
    }
    res.status(204).send();
});



