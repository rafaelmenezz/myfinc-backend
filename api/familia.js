const bcrypt = require('bcrypt')

   module.exports = app => {
      const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator
      
      const encryptPassword = senha =>{
         const salt = bcrypt.genSaltSync(10)
         return bcrypt.hashSync(senha, salt)
     }

     //metodo post
     const save = async (req, res) => {
      

     }
}