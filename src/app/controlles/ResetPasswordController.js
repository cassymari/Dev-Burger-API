import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import * as Yup from 'yup';
import { Op } from 'sequelize';

import User from '../models/User.js';

class ResetPasswordController {
  async store(request, response) {
    const schema = Yup.object({
      token: Yup.string().required('O token é obrigatório.'),

      password: Yup.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres.')
        .required('Digite a nova senha.'),

      passwordConfirmation: Yup.string()
        .oneOf(
          [Yup.ref('password')],
          'As senhas precisam ser iguais.',
        )
        .required('Confirme a nova senha.'),
    });

    try {
      await schema.validate(request.body, {
        abortEarly: false,
      });
    } catch (error) {
      return response.status(400).json({
        errors: error.errors,
      });
    }

    try {
      const { token, password } = request.body;

      const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        where: {
          reset_password_token: tokenHash,

          reset_password_expires: {
            [Op.gt]: new Date(),
          },
        },
      });

      if (!user) {
        return response.status(400).json({
          message:
            'O link é inválido ou expirou. Solicite uma nova recuperação.',
        });
      }

      const password_hash = await bcrypt.hash(password, 10);

      await user.update({
        password_hash,
        reset_password_token: null,
        reset_password_expires: null,
      });

      return response.json({
        message:
          'Senha redefinida com sucesso. Você já pode entrar.',
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);

      return response.status(500).json({
        message: 'Não foi possível redefinir a senha.',
      });
    }
  }
}

export default new ResetPasswordController();