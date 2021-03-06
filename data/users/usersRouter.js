// Node Modules
const express = require("express");

// Router level middleware
const router = express.Router();

const db = require("../helpers/userDb");

// GET all users; root
router.get("/", (req, res) => {
  db
    .get()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while retrieving users."
      });
    });
});

// GET user from id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db
    .get(id)
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({
          error: "The user could not be found."
        });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while retrieving the specified user."
      });
    });
});

// GET user posts by id
router.get("/:id/posts", (req, res) => {
  const { id } = req.params;

  db
    .getUserPosts(id)
    .then(posts => {
      if (users.length === 0) {
        res.status(404).json({
          error: "The user could not be found."
        });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while retrieving the specified user's posts."
      });
    });
});

// POST new user to db; insert()
router.post("/", (req, res) => {
  const user = req.body;

  // Make sure a name is provided for new user
  if (user.name) {
    db
      .insert(user)
      .then(response => {
        res.status(201).json(response);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while adding a new user."
        });
      });
  } else {
    res.status(400).json({
      error: "Please provide a name for the new user."
    });
  }
});

// UPDATE user
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const update = req.body;

  // Make sure name is provided for updated user.
  if (!update.name) {
    res.status(400).json({
      error: "Please provide a name for the updated user."
    });
  }

  db
    .update(id, update)
    .then(count => {
      if (count > 0) {
        db.get(id).then(updatedUser => {
          res.status(200).json(updatedUser);
        });
      } else {
        res.status(404).json({ error: "Could not find specified user." });
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while adding a new user."
      });
    });
});

// REMOVE user
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let user;

  db
    .get(id)
    .then(response => {
      if (response.length > 0) {
        user = { ...response };

        db.remove(id).then(response => {
          res.status(200).json(user);
        });
      } else {
        res.status(404).json({
          error: "The user with the specified ID does not exist."
        });
      }
    })
    .catch(error => {
      res.status(404).json({
        error: "Could not find specified user."
      });
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while removing a new user."
      });
    });
});

module.exports = router;
