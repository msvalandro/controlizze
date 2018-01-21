import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';

module.exports = app => {
    let api = {};
    const config = app.config;
    const { usuario } = app.database.models;

    api.autentica = (req, res) => {
        if (req.body.email && req.body.senha) {
            const email = req.body.email;
            const senha = req.body.senha;

            usuario.findOne({where: {email}})
                .then(user => {
                    if (usuario.isPassword(user.senha, senha)) {
                        const payload = {id: user.id};
                        res.json({
                            token: jwt.sign(payload, config.jwtSecret, {expiresIn: 84600})
                        });
                    } else {
                        res.sendStatus(HttpStatus.UNAUTHORIZED);
                    }
                })
                .catch(() => res.sendStatus(HttpStatus.UNAUTHORIZED));
        } else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    };

    return api;
}