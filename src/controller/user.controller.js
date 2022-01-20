
const User = require("../model/user.model");
const jwt = require('jsonwebtoken');
const { generateAccessToken, validateRefreshToken } = require("../utils/authenticate")

module.exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ id })
        if (!user) return res.status(404).json({ msg: "user not found" });
        res.status(200).json(user)

    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}

module.exports.register = async (req, res) => {
    try {
        const { body } = req;
        console.log("file: user.controller.js ~ line 26 ~ body", body);
        let user = await User.findOne({ email: body.email });
        if (user) return res.status(409).json({ data: `User already exists with this email.` });
        user = new User(body);
        await user.save();
        await user.setHashedPassword();
        return res.status(200).json({ data: "Registration Successful!", user })

    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}

module.exports.login = async (req, res) => {
    try {
        const { body } = req;
        let user = await User.findOne({ email: body.email });
        if (!user) return res.status(403).json({ data: `Email or password is invalid` });
        let checkPassword = await user.compareHashedPassword(body.password);
        if (!user || !checkPassword) return res.status(403).json({ data: `Email or password is invalid` });
        if (checkPassword && user) {
            let data = {
                username: user.username,
                id: user.id,
                email: user.email
            }
            const accessToken = await generateAccessToken(data);
            // const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
            // user.refreshToken.push(refreshToken);
            await user.save();
            return res.status(200).send({ token: accessToken, user: data });
        }


    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}

module.exports.token = async (req, res) => {
    try {
        const { token } = req.body;
        let user = await User.findOne({ refreshToken: token });
        if (token == null) return res.sendStatus(401);
        if (user == null) return res.sendStatus(403);
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            const accessToken = generateAccessToken({ name: user.name });
            return res.json(accessToken)
        })
    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}

module.exports.logout = async (req, res) => {
    try {
        let user = await User.findOne({ refreshToken: req.body.token });
        if (!user) return res.sendStatus(404)
        if (req.body.token == null) return res.sendStatus(401);
        let refreshTokens = user.refreshToken.filter(async (token) => {
            if (token !== req.body.token) {
                console.log("token 87: ", token)
            }
        });
        user.refreshToken = [];
        await user.save()
        return res.status(200).send({ msg: "Logout" });
    }
    catch (err) {
        res.status(500).send(err.stack)
    }
}



