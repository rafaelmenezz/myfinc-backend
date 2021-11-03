const bcrypt = require('bcrypt')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError} = app.api.validator

    const encryptPassword = senha =>{
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(senha, salt)
    }

    //metodo post
    const save = async (req, res) => {
        const usuario = {...req.body}
        if(req.params.cod) usuario.cod = req.params.cod

        if(usuario.cod){
            try {
               existsOrError(usuario.nome, "Nome não informado")
               existsOrError(usuario.telefone, "Telefone não informado")
               existsOrError(usuario.email, "E-mail não informado")
               existsOrError(usuario.login, "Login não informado")
               existsOrError(usuario.senha, "Senha não informada")
            }catch (msg) {
                return res.status(400).send(msg)
            }
            app.db('usuarios')
                .update({
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    login: usuario.login
                    })
                .where({id: usuario.id})
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send('oi?' + err.message))
        }else{
        try {
            existsOrError(usuario.nome, "Nome não informado")
            existsOrError(usuario.email, "E-mail não informado")
            existsOrError(usuario.login, "Login não informado")
            existsOrError(usuario.senha, "Senha não informada")
            existsOrError(usuario.confirmaSenha, "Confirmação de Senha Inválida")
            existsOrError(usuario.senha, usuario.confirmaSenha, "Senha não conferem")
            const usuarioFromDB = await app.db('usuarios')
                .where({email: usuario.email}).first()
            if(!usuario.id){ 
            notExistsOrError(usuarioFromDB, 'Usuário já cadastrado')
            }   
        } catch (msg) {
            return res.status(400).send(msg)
        }
        usuario.senha = encryptPassword(req.body.senha)
        delete usuario.confirmaSenha       
            app.db('usuarios')
                .insert(usuario)
                .then(_=> res.status(204).send())
                .catch(err => res.status(500).send(err))
        }   
        
    }
    const get = (req, res) => {
        app.db('usuarios')
            .select('id', 'nome', 'login', 'telefone', 'email')
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send(err))
    }
    const getById = (req, res) => {
        const id = req.params.id
        app.db('usuarios')
            .select('id', 'nome', 'login', 'telefone', 'email')
            .where({id: id})
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send(err))
    }
    return {save, get, getById}
}