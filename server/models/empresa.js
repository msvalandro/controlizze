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
		nomefantasia: {
			type: DataType.STRING,
	  		allowNull: false,
	  		validate: {
				notEmpty: true,
	  		},
		},
		cnpj: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [17, 17]
			}
		}
  	});
  	return empresa;
};
