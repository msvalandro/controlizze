export default (sequelize, DataType) => {

	const Lancamento = sequelize.define('lancamento', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		descricao: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		data: {
			type: DataType.DATE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		valor: {
			type: DataType.DECIMAL(10,2),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		numeronf: {
			type: DataType.INTEGER
		}
	});

	Lancamento.associate = models => {
		const lancamento = models.lancamento;
		lancamento.belongsTo(models.empresa);
		lancamento.belongsTo(models.tipolancamento);
		lancamento.belongsTo(models.categorialancamento);
	};

	return Lancamento;
};