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
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
        strict: true,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.errors,
      });
    }

    try {
      const { name, email, password } = request.body;

      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser) {
        return response.status(400).json({
          message: 'Este e-mail já está cadastrado.',
        });
      }

      const password_hash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email: normalizedEmail,
        password_hash,
        admin: false,
      });

      return response.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
      });
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

      return response.status(500).json({
        message: 'Não foi possível cadastrar o usuário.',
      });
    }
  }
}

export default new UserController();