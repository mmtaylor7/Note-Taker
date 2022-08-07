const express = require("express");
const path = require("path");
const fs = require("fs");
const { get } = require("http");
const router = require("express").Router();

const PORT = 4200;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//get for index.html main page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
//get for notes.html notetaker page
app.get("/notes", (req, res) => {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//reading the db.json file and returning all saved notes as JSON
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (error, data) => {
    if (error) {
      console.error(error);
      return;
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//app is listening on port variable 4200 defined at top
app.listen(PORT, () => console.log(`Listening at ${PORT}`));
