import * as Yup from 'yup';
import { Op } from 'sequelize';

import Category from '../models/Category.js';

import { uploadImageToCloudinary } from '../../service/cloudinaryUpload.js';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.errors,
      });
    }

    try {
      if (!request.file) {
        return response.status(400).json({
          error: 'Envie uma imagem para a categoria.',
        });
      }

      const { name } = request.body;

      const existingCategory = await Category.findOne({
        where: {
          name,
        },
      });

      if (existingCategory) {
        return response.status(400).json({
          error: 'Essa categoria já existe.',
        });
      }

      const uploadResult = await uploadImageToCloudinary(
        request.file.buffer,
        'devburger/categories',
      );

      const category = await Category.create({
        name,
        path: uploadResult.secure_url,
      });

      return response.status(201).json(category);
    } catch (error) {
      console.error('ERRO AO CRIAR CATEGORIA:', error);

      return response.status(500).json({
        message: 'Não foi possível cadastrar a categoria.',
      });
    }
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.errors,
      });
    }

    try {
      const { id } = request.params;
      const { name } = request.body;

      const category = await Category.findByPk(id);

      if (!category) {
        return response.status(404).json({
          message: 'Categoria não encontrada.',
        });
      }

      if (name) {
        const existingCategory = await Category.findOne({
          where: {
            name,
            id: {
              [Op.ne]: id,
            },
          },
        });

        if (existingCategory) {
          return response.status(400).json({
            error: 'Essa categoria já existe.',
          });
        }
      }

      let imageUrl = category.path;

      if (request.file) {
        const uploadResult = await uploadImageToCloudinary(
          request.file.buffer,
          'devburger/categories',
        );

        imageUrl = uploadResult.secure_url;
      }

      await category.update({
        name: name ?? category.name,
        path: imageUrl,
      });

      return response.status(200).json(category);
    } catch (error) {
      console.error('ERRO AO ATUALIZAR CATEGORIA:', error);

      return response.status(500).json({
        message: 'Não foi possível atualizar a categoria.',
      });
    }
  }

  async index(_request, response) {
    try {
      const categories = await Category.findAll();

      return response.status(200).json(categories);
    } catch (error) {
      console.error('ERRO CATEGORY:', error);

      return response.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new CategoryController();