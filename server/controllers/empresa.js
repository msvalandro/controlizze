module.exports = (app) => {
  const api = {};
  const { empresa } = app.database.models;

  api.lista = (req, res) => {
    empresa.findAll({})
      .then(result => res.json(result))
      .catch(() => res.status(412));
  };

  api.buscaPorId = (req, res) => {
    empresa.findOne({ where: req.params })
      .then(result => res.json(result))
      .catch(() => res.status(412));
  };

  api.adiciona = (req, res) => {
    empresa.create(req.body)
      .then(result => res.json(result))
      .catch(() => res.status(412));
  };

  api.atualiza = (req, res) => {
    empresa.update(req.body, { where: req.params })
      .then(result => res.json(result))
      .catch(() => res.status(412));
  };

  api.deleta = (req, res) => {
    empresa.destroy({ where: req.params })
      .then(() => res.sendStatus(204))
      .catch(() => res.status(412));
  };

  return api;
};
