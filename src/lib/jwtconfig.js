const jwt = require('jsonwebtoken');

const getToken = (payload) => {
    return jwt.sign({
        data: payload
    }, 'Capibara-secret', { expiresIn: '1h' });
}

const getTokenData = (token) => {
    let data = null;
    jwt.verify(token, 'Capibara-secret', (err, decoded) => {
        if(err) {
            console.log('Error al obtener data del token');
        } else {
            data = decoded;
        }
    });

    return data;
}

module.exports = {
    getToken,
    getTokenData
}