const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "../db.json");
const categoriesPath = path.join(__dirname, "../categories.json");
let db = require('../db.json')
let dbCategories = require('../categories.json')
const prefixUrl = "https://api.themoviedb.org/3"; 
const options = {
  params: {
      api_key: process.env.API_KEY
  }
};

router.get("/", async function (_req, res) {
  const urlToFetch = `https://api.themoviedb.org/3/genre/movie/list`;
  let categories = await axios
    .get(urlToFetch, options)
    .catch(err => res.json(err));
  categories = categories.data.genres;
  const filteredCategories = categories.filter(c => {
    const check = dbCategories.find(category => c.id === category.id);
    return !Boolean(check);
  });  
  res.render("home");
  saveCategoriesOnDB(filteredCategories); 
})

router.get("/search", async function(req, res) {
  const urlToFetch = `${prefixUrl}/search/movie`; 
  if (req.query.filterBy) {
    options.params.query = req.query.filterBy;
    let content = await axios
      .get(urlToFetch, options)
      .catch(err => res.json(err));
    content = content.data.results;
    res.render("collection", {content: content});
  }
});

router.get("/movies/genres", async function(_req, res) {
  const urlToFetch = `https://api.themoviedb.org/3/genre/serie/list`;
  let content = await axios
    .get(urlToFetch, options)
    .catch(err => res.json(err));
    console.log(content);
    
  // return res.status(200).json(content.data.genres);
});

router.get("/movies", async function(_req, res) {
  const urlToFetch = `${prefixUrl}/discover/movie`;
  let content = await axios
    .get(urlToFetch, options)
    .catch(err => res.json(err));
  content = content.data.results;
  content = content.map(c => ({...c, rating: 0, fav:false, library: false, type: "movie"}));
  const filteredContent = content.filter(c => {
    const check = db.find(content => c.id === content.id);
    return !Boolean(check);
  });
  res.render("collection", { categories: dbCategories, content: content});
  saveContentOnDB(filteredContent);  
});

router.get("/series", async function(_req, res) {
  let urlToFetch = `${prefixUrl}/discover/tv`;
  let content = await axios
    .get(urlToFetch, options)
    .catch(err => res.json(err));
  content = content.data.results;
  content = content.map(c => ({...c, rating: 0, fav:false, library: false, type: "tvSerie"}));
  let filteredContent = content.filter(c => {
    let check = db.find(content => c.id === content.id);
    return !Boolean(check);
  });
  res.render("collection", { categories: dbCategories, content: content });
  saveContentOnDB(filteredContent);
});

router.get("/movies/:id", async function(req, res) {
  let id = parseInt(req.params.id);
  let result = db.filter(element => element.id === id && element.type === "movie");
  res.render("detail", {detail: result[0]});
});

router.get("/series/:id", async function(req, res) {
  let id = parseInt(req.params.id);  
  let result = db.filter(element => element.id === id && element.type === "tvSerie");  
  res.render("detail", { detail: result[0]});
});

router.get("/my-favourites", async function(_req, res) {
  let content = db.filter(element => element.fav === true);
  res.render("collection", { content: content });
});

router.get("/my-library", async function(_req, res) {
  let content = db.filter(element => element.library === true);
  res.render("collection", { content: content });
});

router.patch("/update-library/:id", async function(req, res) {
  content = db.find(element => element.id === parseInt(req.params.id)); 
  content.library = !Boolean(content.library);
  res.status(200).send('ok');
  fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');
});

router.patch("/update-fav/:id", async function(req, res) {  
  const element = db.find(e => e.id === parseInt(req.params.id)); 
  element.fav = !Boolean(element.fav);
  res.status(200).send('ok');
  fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');
});

router.patch("/update-rating/:id", async function(req, res) {  
  const element = db.find(e => e.id === parseInt(req.params.id));   
  element.rating = req.body.rating;
  res.status(200).send('ok');
  fs.writeFileSync(dbPath, JSON.stringify(db), 'utf8');
});

async function saveContentOnDB(content) {
  db = [...db, ...content];
  fs.writeFileSync(dbPath, JSON.stringify(db));
}

async function saveCategoriesOnDB(newCategories) {
  dbCategories = [...dbCategories, ...newCategories];
  fs.writeFileSync(categoriesPath, JSON.stringify(dbCategories));
}

module.exports = router;