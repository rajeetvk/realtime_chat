// JWT verification middleware will go here
const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied: Token not provided" });

    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodeduser) => {
        if (err) {
            return res.status(403).json({ error: "Invalid Token" });
        }

        req.user = decodeduser;
        next();
    })
}

module.exports = { verifytoken };