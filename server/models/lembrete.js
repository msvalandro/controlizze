export default (sequelize, DataType) => {

	const Lembrete = sequelize.define('lembrete', {
		id: {
			type: DataType.INTEGER,
	  		primaryKey: true,
	  		autoIncrement: true
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
		descricao: {
			type: DataType.STRING
		},
		empresaId: {
			type: DataType.INTEGER,
			allowNull: false, 
			validate: {
				notEmpty: true
			}
		}
	});

	Lembrete.associate = models => {
		const lembrete = models.lembrete;
		lembrete.belongsTo(models.empresa, {
			foreignKey: 'empresaId',
			onDelete: 'cascade'
		});
	};

	return Lembrete;
};