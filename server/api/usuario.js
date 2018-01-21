module.exports = (app) => {
    const api = {};
    const { usuario } = app.database.models;
  
    api.lista = (req, res) => {
      usuario.findAll({})
        .then(result => res.json(result))
        .catch(() => res.status(412));
    };
  
    api.buscaPorId = (req, res) => {
      usuario.findOne({ where: req.params })
        .then(result => res.json(result))
        .catch(() => res.status(412));
    };
  
    api.adiciona = (req, res) => {
      usuario.create(req.body)
        .then(result => res.json(result))
        .catch(() => res.status(412));
    };
  
    api.atualiza = (req, res) => {
      usuario.update(req.body, { where: req.params })
        .then(result => res.json(result))
        .catch(() => res.status(412));
    };
  
    api.deleta = (req, res) => {
      usuario.destroy({ where: req.params })
        .then(() => res.sendStatus(204))
        .catch(() => res.status(412));
    };
  
    return api;
  };
  