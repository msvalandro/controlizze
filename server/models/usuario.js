import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataType) => {
	const Usuario = sequelize.define('usuario', {
		id: {
			type: DataType.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		primeiroNome: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		sobreNome: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		email: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		},
		senha: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		}
	},
	{
		hooks: {
			beforeCreate: user => {
				const salt = bcrypt.genSaltSync();
				user.set('senha', bcrypt.hashSync(user.senha, salt));
			}
		}
	});

	Usuario.associate = models => {
		Usuario.hasMany(models.Empresa, {
			foreignKey: 'usuarioId'
		});
	};

	Usuario.isPassword = (encodedPassword, password) => bcrypt.compareSync(password, encodedPassword)	;
	return Usuario;
}