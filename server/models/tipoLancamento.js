export default (sequelize, DataType) => {

    const TipoLancamento = sequelize.define('tipolancamento', {
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

    TipoLancamento.associate = models => {
        const tipoLancamento = models.tipolancamento;
        tipoLancamento.hasMany(models.lancamento);
    };

    return TipoLancamento;
};