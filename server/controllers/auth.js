module.exports = (app) => {
    const api = app.api.auth;

    app.post('/autentica', api.autentica);
    app.route('/api/*')
        .all(app.auth.authenticate());
};