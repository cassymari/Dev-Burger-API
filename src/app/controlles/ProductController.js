import * as Yup from 'yup';

import Products from '../models/Products.js';
import Category from '../models/Category.js';

import { uploadImageToCloudinary } from '../../service/cloudinaryUpload.js';

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
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
          error: 'Envie uma imagem para o produto.',
        });
      }

      const { name, price, category_id, offer } = request.body;

      const uploadResult = await uploadImageToCloudinary(
        request.file.buffer,
        'devburger/products',
      );

      const newProduct = await Products.create({
        name,
        price,
        category_id,
        path: uploadResult.secure_url,
        offer:
          offer === true ||
          offer === 'true',
        active: true,
      });

      return response.status(201).json(newProduct);
    } catch (error) {
      console.error('ERRO AO CRIAR PRODUTO:', error);

      return response.status(500).json({
        message: 'Não foi possível cadastrar o produto.',
      });
    }
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
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
      const { name, price, category_id, offer } = request.body;

      const product = await Products.findByPk(id);

      if (!product) {
        return response.status(404).json({
          message: 'Produto não encontrado.',
        });
      }

      let imageUrl = product.path;

      if (request.file) {
        const uploadResult = await uploadImageToCloudinary(
          request.file.buffer,
          'devburger/products',
        );

        imageUrl = uploadResult.secure_url;
      }

      await product.update({
        name: name ?? product.name,
        price: price ?? product.price,
        category_id: category_id ?? product.category_id,
        path: imageUrl,
        offer:
          offer !== undefined
            ? offer === true || offer === 'true'
            : product.offer,
      });

      return response.status(200).json(product);
    } catch (error) {
      console.error('ERRO AO ATUALIZAR PRODUTO:', error);

      return response.status(500).json({
        message: 'Não foi possível atualizar o produto.',
      });
    }
  }

  async index(request, response) {
    try {
      const { active } = request.query;

      const products = await Products.findAll({
        where: {
          active: active === 'false' ? false : true,
        },
        include: {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      });

      return response.status(200).json(products);
    } catch (error) {
      console.error('ERRO PRODUCT:', error);

      return response.status(500).json({
        message: error.message,
      });
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;

      const product = await Products.findByPk(id);

      if (!product) {
        return response.status(404).json({
          message: 'Produto não encontrado.',
        });
      }

      await product.update({
        active: false,
      });

      return response.status(200).json({
        message: 'Produto desativado com sucesso.',
      });
    } catch (error) {
      console.error('ERRO AO DESATIVAR PRODUTO:', error);

      return response.status(500).json({
        message: 'Não foi possível desativar o produto.',
      });
    }
  }

  async restore(request, response) {
    try {
      const { id } = request.params;

      const product = await Products.findByPk(id);

      if (!product) {
        return response.status(404).json({
          message: 'Produto não encontrado.',
        });
      }

      await product.update({
        active: true,
      });

      return response.status(200).json({
        message: 'Produto restaurado com sucesso.',
      });
    } catch (error) {
      console.error('ERRO AO RESTAURAR PRODUTO:', error);

      return response.status(500).json({
        message: 'Não foi possível restaurar o produto.',
      });
    }
  }
}

export default new ProductController();