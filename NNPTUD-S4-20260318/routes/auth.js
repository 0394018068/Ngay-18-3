var express = require("express");
var router = express.Router();

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let fs = require('fs');

const privateKey = fs.readFileSync("private.pem");

// user giả
let user = {
    id: "123",
    username: "admin",
    password: bcrypt.hashSync("123456", 10)
};

// LOGIN
router.post('/login', function (req, res) {
    let { username, password } = req.body;

    if (username !== user.username) {
        return res.status(400).json({ message: "Sai username" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Sai password" });
    }

    let token = jwt.sign(
        { id: user.id, username: user.username },
        privateKey,
        {
            algorithm: "RS256",
            expiresIn: "1h"
        }
    );

    res.json({ token });
});

// /me
const { CheckLogin } = require("../utils/authHandler");

router.get('/me', CheckLogin, function (req, res) {
    res.json(req.user);
});

module.exports = router;