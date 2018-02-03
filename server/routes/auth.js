module.exports = (app) => {
    const api = app.controllers.auth;

    app.post('/autentica', api.autentica);
    app.route('/api/*')
        .all(app.auth.authenticate());
};