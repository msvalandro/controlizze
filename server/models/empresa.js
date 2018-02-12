export default (sequelize, DataType) => {
	const Empresa = sequelize.define('empresa', {
		id: {
	  		type: DataType.INTEGER,
	  		primaryKey: true,
	  		autoIncrement: true,
		},
		cnpj: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		nome: {
	  		type: DataType.STRING,
	  		allowNull: false,
	  		validate: {
				notEmpty: true,
	  		},
		},
		data: {
			type: DataType.DATE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		cep: {
			type: DataType.STRING,
	  		allowNull: false,
	  		validate: {
				notEmpty: true
	  		},
		},
		atividade: {
			type: DataType.STRING,
	  		allowNull: false,
	  		validate: {
				notEmpty: true,
	  		},
		},
		usuarioId: {
			type: DataType.INTEGER,
		}
	});

	Empresa.associate = models => {
		Usuario.belongsTo(models.Usuario);
	};

  	return Empresa;
};
