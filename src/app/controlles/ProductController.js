import * as Yup from 'yup';
import Products from '../models/Products.js';
import Category from '../models/Category.js';

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
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      });
    }

    const { name, price, category_id, offer } = request.body;

    const filename = request.file?.filename;

    const newProduct = await Products.create({
      name,
      price,
      category_id,
      path: filename,
      offer

    });

    return response.status(201).json(newProduct);
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
    } catch (err) {
      return response.status(400).json({
        error: err.errors,
      });
    }

    const { name, price, category_id, offer } = request.body;
    const { id } = request.params

    let path
    if (request.file) {
      const { filename } = request.file;
      path = filename

    }



    await Products.update({
      name,
      price,
      category_id,
      path,
      offer,

    }, {
      where: {
        id,
      }
    });

    return response.status(200).json();
  }



 async index(request, response) {
  try {
    const { active } = request.query;

    const products = await Products.findAll({
      where: {
        active: active === "false" ? false : true,
      },
      include: {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    });

    return response.json(products);
  } catch (error) {
    console.error("ERRO PRODUCT:");
    console.error(error);

    return response.status(500).json({
      message: error.message,
    });
  }
}



  async delete(req, res) {
    const { id } = req.params;

    await Products.update(
      {
        active: false,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({
      message: 'Produto desativado com sucesso',
    });
  }

  async restore(request, response) {
  const { id } = request.params;

  await Products.update(
    {
      active: true,
    },
    {
      where: {
        id,
      },
    }
  );

  return response.status(200).json({
    message: 'Produto restaurado com sucesso',
  });
}
}







export default new ProductController();