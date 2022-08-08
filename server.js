const express = require("express");
const path = require("path");
const fs = require("fs");
const { get } = require("http");
const router = require("express").Router();
//import npm package uniqid in rde to give each note a unique id when its saved
const uniqueID = require("uniqid");
const e = require("express");

const PORT = process.env.PORT || 4200;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//get for notes.html notetaker page
app.get("/notes", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//reading the db.json file and returning all saved notes as JSON
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (error, data) => {
    if (error) {
      console.error("There is an error");
      return;
    } else {
      return res.json(JSON.parse(data));
    }
  });
});

// post request to 'receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.'

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request has been received to add note`);

  const title = req.body.title;
  const text = req.body.text;

  //if title and text both exist
  if (title && text) {
    //then create a new note
    const newNote = {
      title,
      text,
      id: uniqueID(),
    };
    //grab notes that have bene created
    fs.readFile("./db/db.json", "utf8", (error, data) => {
      if (error) {
        console.error(error);
        //convert to JSON object
      } else {
        const convertedNotes = JSON.parse(data);
        //add the new note
        convertedNotes.push(newNote);

        //writing the updated notes into the html
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(convertedNotes, null, 4),
          (writeErr) =>
            writeErr ? console.error(writeErr) : res.sendStatus(200)
        );
      }
    });
  }
});

//app is listening on port variable 4200 defined at top
app.listen(PORT, () => console.log(`Listening at ${PORT}`));

//get for index.html main page
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
