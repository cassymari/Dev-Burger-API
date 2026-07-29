import crypto from 'node:crypto';
import * as Yup from 'yup';

import User from '../models/User.js';

class ForgotPasswordController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string()
        .email('Digite um e-mail válido.')
        .required('O e-mail é obrigatório.'),
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
      const email = request.body.email.trim().toLowerCase();

      const user = await User.findOne({
        where: { email },
      });

      const genericMessage =
        'Se o e-mail estiver cadastrado, as instruções de recuperação serão geradas.';

      if (!user) {
        return response.json({
          message: genericMessage,
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');

      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const resetPasswordExpires = new Date(
        Date.now() + 30 * 60 * 1000,
      );

      await user.update({
        reset_password_token: resetTokenHash,
        reset_password_expires: resetPasswordExpires,
      });

      const frontendUrl =
        process.env.FRONTEND_URL || 'http://localhost:5173';

      const resetLink =
        `${frontendUrl}/redefinir-senha?token=${resetToken}`;

      const responseData = {
        message: genericMessage,
      };

      // Apenas para testar localmente.
      // O token não será retornado em produção.
      if (process.env.NODE_ENV !== 'production') {
        responseData.resetLink = resetLink;
      }

      return response.json(responseData);
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);

      return response.status(500).json({
        message: 'Não foi possível processar a solicitação.',
      });
    }
  }
}

export default new ForgotPasswordController();