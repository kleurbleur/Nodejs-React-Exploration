const Note = require('../models/note.model.js');

exports.create = function(req, res) {
    // Create and Save a new Note
    if(!req.body.content) {
        return res.status(400).send({message: "Note can not be empty"});
    }

    var note = new Note({title: req.body.title || "Untitled Note", content: req.body.content});

    note.save(function(err, data) {
        if(err) {
            console.log(err);
            res.status(500).send({message: "Some error occurred while creating the Note."});
        } else {
            res.send(data);
        }
    });
};

// retrieve and return all notes from the database
exports.findAll = function(req, res) {
  Note.find(function(err,notes){
    if(err) {
      console.log(err);
      res.status(500).send({message: "An error has occured while retrieving the notes."})
    } else {
      res.send(notes);
    }
  });
};

// find a single note with a noteID
exports.findOne = function(req, res) {
  Note.findById(req.params.noteId, function(err, note) {
    if(err) {
      console.log(err);
      if(err.kind === 'ObjectID') {
        return res.status(404).send({message: "Note with id " + req.params.noteId + " not found."});
      } else {
        return res.status(500).send({message: "An error has occured while retrieving the note."})
      }
    } else if (!note) {
      return res.status(404).send({message: "Note with id " + req.params.noteId + " not found."});
    } else {
      res.send(note);
    }
  });
};

// find notes with a defined word fromt the params
exports.findWord = function(req, res) {
    Note.find({'title': {'$regex': req.params.word }},function(err, notes){
        if(err){
            return res.status(500).send({message: "Some error occured while retrieving the notes." });
        } else if (!notes) {
            return res.status(400).send({message: "No notes with the word note were found."});
        } else {
           res.send(notes);
        }
    });
};

// update a single note identified by a noteID
exports.update = function(req, res) {
  Note.findById(req.params.noteId, function(err,note) {
    if (err) {
      console.log(err);
      if(err.kind === 'ObjectID') {
        return res.status(404).send({message: "Note with id " + req.params.noteId + " not found."});
      } else {
        return res.status(500).send({message: "An error has occured while retrieving the note with that certain ID."})
      }
    } else if (!note) {
      return res.status(404).send({message: "Note with id " + req.params.noteId + " turns out not to be a note."});
    } else {
      note.title = req.body.title;
      note.content = req.body.content;

      note.save(function(err,data) {
        if (err) {
          res.status(500).send({message: "Could not update note with id " + req.params.noteId});
        } else {
          res.send(data);
        }
      });

    }
  });
};

// delete a note with a specified noteID in the request
exports.delete = function(req, res) {
  Note.findByIdAndRemove(req.params.noteId, function(err, note) {
    if(err){
        console.log(err);
        if(err.kind === 'ObjectID'){
          return res.status(404).send({message: "Note with id " + req.params.noteId + " not found."});
        } else {
          return res.status(500).send({message: "Could not delete note with id " + req.params.noteId});
        }
    } else if (!note) {
      return res.status(404).send({message: "Note with id " + req.params.noteId + " not found."});
    } else {
      res.send({message: "Note deleted."})
    }
  });
};
