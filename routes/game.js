const express = require('express');
const User = require('../models/User.js'); // User schema
const Musicals = require('../models/Musicals.js'); // Musicals schema
const router = express.Router();
const fetch = require("node-fetch");

/* 
    Itunes API: search URL
    https://itunes.apple.com/search?term=Love%20Is%20an%20Open%20Door&media=music&entity=song&limit=1
*/

// get route for randomly return a set of 5 songs 
router.get("/questions", (req, res) => {
  Musicals.find((err, songs) => { 
    let idArr = []; idArr.push(Math.floor(Math.random() * 31)); // a random array of 20 ids
    for (let i =1; i<20; i ++){
      // check for id duplication
      let newId;
      let duplicateFlag = true;
      while (duplicateFlag) {
        newId = Math.floor(Math.random() * 31); 
        duplicateFlag = false;
        for (let j=0; j<idArr.length; j++){
          if (idArr[j] == newId) {
            duplicateFlag = true;
            break;
          }
        }
      }
      idArr.push(newId);
    }
    console.log(idArr)
    // An array of promise
    let dbPromises = idArr.map(id => Musicals.findOne({"SongId": id}));
    Promise.all(dbPromises).then(songs => {
      let songArr = songs.map(song => song.TrackName)
      songArr = songArr.map(x => encodeURIComponent(x))
      let ItunesSearch = songArr.map(x =>`https://itunes.apple.com/search?term=${x}&media=music&entity=song&limit=1`)
      console.log(ItunesSearch)
      let ItunesPromises = ItunesSearch.map(x => fetch(x));
      // fetch arrays from Itunes
      Promise.all(ItunesPromises).then(result => {
        let jsonArr = result.map(x => x.json());
        Promise.all(jsonArr).then(json => {
          json = json.map(x => x.results);
          let output =[];
          json.forEach(x => {
            output.push({
              "trackName": x[0].trackName,
              "artistName": x[0].artistName,
              "preview": x[0].previewUrl,
              "genre": x[0].primaryGenreName
            });
          });
          // refactor the format of output
          let trackNameArr1 = [], trackNameArr2 = [], trackNameArr3 = [], trackNameArr4 = [], trackNameArr5 = []; 
          let randomNum1 = Math.floor(Math.random() * 4); // random num from 0 - 3 (inclusive)
          let randomNum2 = Math.floor(Math.random() * 4)+4; // random num from 0 - 3 (inclusive)
          let randomNum3 = Math.floor(Math.random() * 4)+8; // random num from 0 - 3 (inclusive)
          let randomNum4 = Math.floor(Math.random() * 4)+12; // random num from 0 - 3 (inclusive)
          let randomNum5 = Math.floor(Math.random() * 4)+16; // random num from 0 - 3 (inclusive)
          for (let i=0; i<17; i+=4) {
            if(i<=3) {trackNameArr1.push(output[i].trackName); trackNameArr1.push(output[i+1].trackName);trackNameArr1.push(output[i+2].trackName);trackNameArr1.push(output[i+3].trackName);}
            if (i>=4 && i<=7) {trackNameArr2.push(output[i].trackName); trackNameArr2.push(output[i+1].trackName);trackNameArr2.push(output[i+2].trackName);trackNameArr2.push(output[i+3].trackName);}
            if (i>=8 && i<=11) {trackNameArr3.push(output[i].trackName); trackNameArr3.push(output[i+1].trackName);trackNameArr3.push(output[i+2].trackName);trackNameArr3.push(output[i+3].trackName);}
            if (i>=12 && i<=15) {trackNameArr4.push(output[i].trackName); trackNameArr4.push(output[i+1].trackName);trackNameArr4.push(output[i+2].trackName);trackNameArr4.push(output[i+3].trackName);}
            if (i>=16 && i<=19) {trackNameArr5.push(output[i].trackName); trackNameArr5.push(output[i+1].trackName);trackNameArr5.push(output[i+2].trackName);trackNameArr5.push(output[i+3].trackName);}
          }
          let formatedOutput =[];
          formatedOutput.push({
            "previewUrl": output[randomNum1].preview,
            "trackNames":trackNameArr1
          })
          formatedOutput.push({
            "previewUrl": output[randomNum2].preview,
            "trackNames":trackNameArr2
          })
          formatedOutput.push({
            "previewUrl": output[randomNum3].preview,
            "trackNames":trackNameArr3
          })
          formatedOutput.push({
            "previewUrl": output[randomNum4].preview,
            "trackNames":trackNameArr4
          })
          formatedOutput.push({
            "previewUrl": output[randomNum5].preview,
            "trackNames":trackNameArr5
          })
          res.send(formatedOutput)
        })
      })
    })
  })
})


router.post("/answers", (req, res, next) => {

  let score = 0;
  
  let answers = req.body.answers;
  let songArr = [];

  // console.log(answers[0].previewUrl);
  // console.log(answers[1].previewUrl);
  // console.log(answers[2].previewUrl);
  // console.log(answers[3].previewUrl);
  // console.log(answers[4].previewUrl);


  for (let i=0; i<5; i++){
    songArr.push(answers[i].trackName);
  }
  // console.log(songArr);

  let dbPromises = songArr.map(song => Musicals.findOne({"trackName": song}));
  Promise.all(dbPromises).then(songs => {
    songArr = songArr.map(x => encodeURIComponent(x))
    let ItunesSearch = songArr.map(x =>`https://itunes.apple.com/search?term=${x}&media=music&entity=song&limit=1`)
    // console.log(ItunesSearch)
    let ItunesPromises = ItunesSearch.map(x => fetch(x));

    Promise.all(ItunesPromises).then(result => {
      let jsonArr = result.map(x => x.json());
      Promise.all(jsonArr).then(json => {
        json = json.map(x => x.results);
        // console.log(json);
        for (let i = 0; i < 5; i++){
          if(json[i][0].previewUrl == answers[i].previewUrl){
            score++;
          }
        }
        let formatedOutput =[];
        formatedOutput.push({
          "score": score
        })
        console.log(formatedOutput);
        res.send(formatedOutput);
        });
      });
      
    
    })
    
})

module.exports = router;
