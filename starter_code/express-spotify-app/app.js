const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');

var SpotifyWebApi = require('spotify-web-api-node');

// Remember to paste your credentials here
var clientId = 'd213c1467fd045b6958d846a5a2f6d99',
  clientSecret = 'a6e03d8f7b7049ceb99358d40879751a';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function (err) {
    console.log('Something went wrong when retrieving an access token', err);
  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// This line set "req.body" for POST routes
// app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('index') // Render "index.hbs"
})


app.get('/artists', (req, res) => {
  spotifyApi.searchArtists(req.query.q)
    .then(data => {
      console.log("data", data.body.artists.items)
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      // Get all the stuff so we can display the name, an image, and a button to show the albums for a particular artist on a new view
      let ourArtists = data.body.artists.items
      // when i find the data i want to display: save to let here, pass to render
      res.render('artists', { ourArtists })
    })
    .catch(err => {
      console.log("Something went wrong at /artists route!", err)
    })
})


app.get('/albums/:artistId', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then(data => {
      console.log('data', data.body.artists.items);
      let artistAlbums = //data.body.artists.items
        res.render('albums', { artistAlbums })
    },
      function (err) {
        console.error("Something went wrong at /albums route!", err);
      }
    );
});


app.listen(3005, () => {
  console.log("Server running on port 3005");
})