/*
 store -> cria dado
 index -> lista todos os dados
 show -> listar um dado
 update -> atualiza dados
 delete -> remover dados
 (nenhum desses métodos podem se repetir, caso seja necessário podemos criar um novo controller.)
*/

import User from '../models/User.js';
import * as Yup from 'yup';
import bcrypt from 'bcrypt';

class UserController {
  async store(request, response) {
    const shema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean(),
    });
    try {
      shema.validateSync(request.body, { abordEarly: false, strict: true });
    } catch (err) {
      return response.status(400).json({ error: err.erros });
    }

    try {
      const { name, email, password, admin } = request.body;
      const existingUser = await User.findOne({
        where: {
          email,
        },
      });
      if (existingUser) {
        return response.status(400).json({ message: 'Email already taken!' });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password_hash,
        admin,
      });

      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });
    } catch (error) {
      console.log('ERRO COMPLETO =>');
      console.log(error);
      console.log(error.parent);
      console.log(error.original);

      return response.status(500).json({
        name: error.name,
        message: error.message,
        parent: error.parent,
        original: error.original,
      });
    }
  }
}

export default new UserController();
