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
			allowNull: false, 
			validate: {
				notEmpty: true
			}
		}
	});

	Empresa.associate = models => {
		const empresa = models.empresa;
		empresa.belongsTo(models.usuario, {
			onDelete: 'cascade'
		});
		empresa.hasMany(models.lancamento, {
			foreignKey: 'empresaId'
		});
	};

  	return Empresa;
};
