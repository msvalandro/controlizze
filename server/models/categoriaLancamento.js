export default (sequelize, DataType) => {

    const CategoriaLancamento = sequelize.define('categorialancamento', {
        id: {
            type: DataType.INTEGER,
	  		primaryKey: true,
	  		autoIncrement: true
        },
        descricao: {
            type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
        }
    });

    CategoriaLancamento.associate = models => {
		const categoriaLancamento = models.categorialancamento;
        categoriaLancamento.belongsTo(models.tipolancamento);
		categoriaLancamento.belongsTo(models.empresa, {
            foreignKey: 'empresaId',
            onDelete: 'cascade'
        });        
        categoriaLancamento.hasMany(models.lancamento, {
            foreignKey: 'categorialancamentoId',
            onDelete: 'restrict'
        });
	};
    return CategoriaLancamento;
};