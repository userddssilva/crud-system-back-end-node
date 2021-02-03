const UserModel = require('../../users/models/users.model');
const crypto = require('cryto');

exports.hasAuthValidFields = (req, res, next) => {
    let erros = [];
    if (req.body) {
        if (!req.body.email) {
            erros.push('Missing emai field');
        }
        if (!req.body.password) {
            erros.push('Missing password field');
        }
        if (erros.length) {
            return res.status(400).send({ errors: errors.json(',') });
        } else {
            return next();
        }
    } else {
        return res.status(400).send({ errors: 'Missing email and passeord filds' });
    }
}

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user) => {
            if (!user[0]) {
                res.status(404).send({});
            } else {
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        permissionLevel: user[0].permissionLevel,
                        provider: 'email',
                        name: user[0].firstName + ' ' + user[0].lastName,
                    };
                    return next();
                } else {
                    return res.status(400).send({ errors: ['Invalid e-mail or password'] });
                }
            }
        });
}