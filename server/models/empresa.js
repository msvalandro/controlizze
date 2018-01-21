export default (sequelize, DataType) => {
  const empresa = sequelize.define('empresa', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });
  return empresa;
};
