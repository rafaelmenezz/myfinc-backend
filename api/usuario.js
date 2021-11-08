const bcrypt = require('bcrypt')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator

    const encryptPassword = senha => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(senha, salt)
    }

    //metodo post
    const save = async (req, res) => {
        const usuario = { ...req.body }
        if (req.params.cod) usuario.cod = req.params.cod

        if (usuario.cod) {
            try {
                existsOrError(usuario.nome, "Nome não informado")
                existsOrError(usuario.email, "E-mail não informado")
                existsOrError(usuario.telefone, "Telefone não informado")
                existsOrError(usuario.senha, "Senha não informada")
            } catch (msg) {
                return res.status(400).send(msg)
            }
            app.db('usuarios')
                .update({
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                })
                .where({ cod: usuario.cod })
                .then(_ => res.status(200).send('Dados do usuário alterado com sucesso!'))
                .catch(err => res.status(500).send(err.message))
        } else {
            try {
                existsOrError(usuario.nome, "Nome não informado")
                existsOrError(usuario.email, "E-mail não informado")
                existsOrError(usuario.senha, "Senha não informada")
                existsOrError(usuario.confirmaSenha, "Confirmação de Senha Inválida")
                existsOrError(usuario.senha, usuario.confirmaSenha, "Senha não conferem")
                const usuarioFromDB = await app.db('usuarios')
                    .where({ email: usuario.email }).first()
                if (!usuario.cod) {
                    notExistsOrError(usuarioFromDB, 'Usuário já cadastrado')
                }
            } catch (msg) {
                return res.status(400).send(msg)
            }
            usuario.senha = encryptPassword(req.body.senha)
            delete usuario.confirmaSenha
            app.db('usuarios')
                .insert(usuario, 'cod').into('usuarios')
                .then(cod => res.json({ cod: cod[0] }))
                .catch(err => res.status(500).send(err))
        }

    }
    // metodo get
    const get = (req, res) => {
        app.db('usuarios')
            .select('cod', 'nome', 'telefone', 'email')
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send('Falha no servidor!'))
    }

    //metodo getById
    const getById = (req, res) => {
        const cod = req.params.cod
        app.db('usuarios')
            .select('cod', 'nome', 'telefone', 'email')
            .where({ cod: cod })
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send('Falha no servidor!'))
    }
    return { save, get, getById }
}