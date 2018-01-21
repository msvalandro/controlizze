import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export default app => {
	const usuario = app.database.models.usuario;
	const opts = {};
	
	opts.secretOrKey = app.config.jwtSecret;
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

	const strategy = new Strategy(opts, (payload, done) => {
		usuario.findById(payload.id)
			.then(user => {
				if (user) {
					return done(null, {
						id: user.id,
						email: user.email
					});
				}
				return done(null, false);
			})
			.catch(err => done(err, null));
	});

	passport.use(strategy);

	return {
		initialize: () => passport.initialize(),
		authenticate: () => passport.authenticate('jwt', app.config.jwtSession)
	};
}