const { authSecret } = require('../.env')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
   const params = {
      secretOrKey: authSecret || process.env.authSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
   }

   const strategy = new Strategy(params, (payload, done) => {
      app.db('usuarios')
         .where({ cod: payload.cod })
         .first()
         .then(usuarios => done(null, usuarios ? { ...payload } : false))
         .catch(err => done(err, false))
   })

   passport.use(strategy)

   return {
      authenticate: () => passport.authenticate('jwt', { session: false })
   }

}