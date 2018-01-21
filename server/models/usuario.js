import bcrypt from 'bcrypt-nodejs';

export default (sequelize, DataType) => {
	const usuario = sequelize.define('usuario', {
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
	usuario.isPassword = (encodedPassword, password) => bcrypt.compareSync(password, encodedPassword)	;
	return usuario;
}