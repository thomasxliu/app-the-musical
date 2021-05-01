const express = require('express');
const User = require('../models/User.js'); // User schema
const Musicals = require('../models/Musicals.js'); // Musicals schema
const router = express.Router();
const fetch = require("node-fetch");

// get all songs in the db
router.get("/admin", (req, res) => {
  // Musicals.find((err, musics) => {
  //     res.send(musics);
  // })
  Musicals.find((err, musics) => {
    let output =[];
    musics.forEach(music => output.push({
      "id": music.SongId,
      "trackName": music.TrackName
    }));
    res.send(output);
  })
})

// get particular song from db
router.get("/admin/:songId", (req, res) => {
  let targetId = req.params.songId;
  Musicals.findOne({"SongId": targetId}, (err, song) => {
    if (song == null) res.send(`No such SongId = ${targetId}`)
    else res.send(song);
  })
})

// admin post songs route 
router.post("/admin/songInsertion", async (req, res) => {
  let songName = req.body.TrackName;
  songName = encodeURI(songName);
  let itunesUrl = `https://itunes.apple.com/search?term=${songName}&media=music&entity=song&limit=1`;
  let iTunesDate = await fetch(itunesUrl).then(res => res.json()).then(data => data);
  if (iTunesDate.resultCount ==0) res.status(404).send("No such song in Itunes");
  else  {
    songName = iTunesDate.results[0].trackName;
    Musicals.find((err, songs) => {
      let songId =0;
      if (songs.length !=0 ) {  // Musicals table isn't empty
        songId = songs[songs.length -1].SongId +1;
      }
      // checking for duplication name of songs
      let duplicateFlag = false;
      songs.forEach(song => {
        if (song.TrackName == songName) duplicateFlag = true;
      });
      if (!duplicateFlag) {
        Musicals.create({
          SongId: songId,
          TrackName: songName
        }).then(suc => {
          if (suc != undefined) res.status(201).send();
          else res.status(404).send();
        })
      } else  res.status(404).send("Insertion failed due to duplication of TrackName");
    })
  }
})

// admin put songs route
router.put("/admin/:songId", (req, res) => {
  let targetId = req.params.songId;
  let newSongName = req.body.TrackName;
  Musicals.findOne({"SongId": targetId}, (err, song) => {
    // insert a new song if targetId doesn't match
    if (song == null) {
      Musicals.find((err, songs) => {
        let songId =0;
        if (songs.length !=0 ) {  // Musicals table isn't empty
          songId = songs[songs.length -1].SongId +1;
        }
        Musicals.create({
          SongId: songId,
          TrackName: newSongName
        }).then(suc => {
          if (suc != undefined) res.status(201).send();
          else res.status(404).send();
        })
      })
    }
    else {  //update existing song
      song.TrackName = newSongName;
      song.save().then(suc => res.status(201).send());
    }
  })
})

// admin delete one song based on id
router.delete("/admin/:songId", (req, res) => {
  let targetId = req.params.songId;
  Musicals.findOne({"SongId" : targetId}, (err, song) => {
    if (song == null) res.status(404).send(`No such songId == ${targetId}`);
    else {
      Musicals.deleteOne({SongId: targetId}, (err, obj) => {
        if (obj.deletedCount ===1 ) res.status(201).send();
      })
    }
  })
})

module.exports = router;