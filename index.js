// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();
const parser = express.json();
const PORT = 3000;

server.use(parser);

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            if (users) {
                res.json(users);
            } else {
                res
                    .status(404)
                    .json({ message: 'Users not found' })
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: 'The users information could not be retrieved.' })

        });
});

server.get(`/api/users/:id`, (req, res) => {
    const { id } = req.params;
    console.log(id)
    db.findById(id)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res
                    .status(404)
                    .json({ message: 'The user with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ message: `The user information could not be retrieved.` })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    if (user.name && user.bio) {
        db.insert(user)
            .then(userId => {
                db.findById(userId.id)
                    .then(user => {
                        res.status(201).json(user);
                    });
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })

    }
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id).then(user => {
        const deletedUser = user;
        db.remove(id)
            .then(countOfDeleted => {
                if (countOfDeleted) {
                    res.json(deletedUser);
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The user could not be removed" })
            })


    }).catch(err => {
        res.status(500).json({ error: "Could not locate user that was marked for deletion." })
    }
    )
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userChanges = req.body;

    if (userChanges.name || userChanges.bio) {
        db.update(id, userChanges)
            .then(countOfUpdated => {
                if (countOfUpdated) {
                    db.findById(id)
                        .then(user => {
                            res.json(user);
                        });
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The user information could not be modified." });
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide name or bio for the user" });
    }
})

server.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});