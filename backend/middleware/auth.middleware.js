const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });
//     try {
//         const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid Token' });
//     }
// };



const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token Expired. Please log in again.' });
        } else {
            return res.status(403).json({ message: 'Invalid Token' });
        }
    }
};

module.exports = verifyToken;



module.exports = verifyToken;