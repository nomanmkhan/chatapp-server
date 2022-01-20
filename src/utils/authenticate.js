const jwt = require('jsonwebtoken');

module.exports.authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.status(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.send(err)
        }
        req.user = user;
        next();
    });

}


module.exports.generateAccessToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' });
}

module.exports.validateRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) { return "forbidden" }
        const accessToken = this.generateAccessToken({ name: user.name });
        return accessToken;
    })
}