const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();
const {
  readFromFile,
  writeToFile,
} = require('./helpers/fsUtils');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((notes) => {
      notes.push(newNote);
      return notes;
    })
    .then((updatedNotes) => writeToFile('./db/db.json', updatedNotes))
    .then(() => res.json(newNote))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to save note' });
    });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
