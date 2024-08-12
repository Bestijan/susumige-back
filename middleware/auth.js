const jwt = require('jsonwebtoken');

const secret = 'af010c115600c00ee246901678110005';

const roleMapping = {
    0: 'admin',
    1: 'user'
    // Add more roles as needed
};

// Middleware to verify token and roles
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('No token provided.');
    }
    
    jwt.verify(token, secret, (err, decoded) => {

        if (err) {
            return res.status(500).send('Failed to authenticate token.');
        }

        // Save user id and role in request for use in other routes
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

function checkRole(role) {
    return (req, res, next) => {
        if (role !== roleMapping[req.userId]) {
            return res.status(403).send('Access Denied: You don\'t have correct privilege to perform this operation');
        }
        next();
    };
}

module.exports = {
    verifyToken,
    checkRole
};