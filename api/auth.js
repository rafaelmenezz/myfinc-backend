const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.senha) {
            return res.status(400).send('Informe o email e senha!')
        }

        const user = await app.db('usuarios')
            .where({ email: req.body.email })
            .first()
        if (!user) return res.status(400).send('Usuário não cadastrado!')

        const isMatch = bcrypt.compareSync(req.body.senha, user.senha)
        if (!isMatch) return res.status(401).send('Email/senha inválidos!')

        const now = Math.floor(Date.now() / 1000)
        const payload = {
            cod: user.cod,
            nome: user.nome,
            email: user.email,
            telefone: user.telefone,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null

        try {
            if (userData) {
                const token = jwt.decode(userData.token, authSecret)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            console.error(e)
        }
        res.send(false)
    }

    return { signin, validateToken }
}