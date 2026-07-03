import * as Yup from 'yup';
import Products from '../models/Products.js';
import Category from '../models/Category.js';
import Order from '../schemas/Order.js';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });

    try {
      schema.validateSync(request.body, {
        abortEarly: false,
        strict: true,
      });

      const { userId, userName } = request;
      const { products } = request.body;

      const productIds = products.map(product => product.id);

      const findedProducts = await Products.findAll({
        where: {
          id: productIds,
        },
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['name'],
          },
        ],
      });

      const mappedProducts = findedProducts.map(product => {
        const productQuantity = products.find(
          item => item.id === product.id
        )?.quantity;

        return {
          id: product.id,
          name: product.name,
          price: product.price,
          url: product.URL,
          category: product.category?.name,
          quantity: productQuantity,
        };
      });

      const order = {
        user: {
          id: userId,
          name: userName,
        },
        products: mappedProducts,
      };

      console.log(
  'MAPPED PRODUCTS:',
  JSON.stringify(mappedProducts, null, 2))

      const newOrder = await Order.create(order);

      return response.status(201).json({
        message: 'Pedido realizado com sucesso',
        order: newOrder,
      });
    

      

    } catch (error) {
      console.error(error);

      return response.status(400).json({
        error: error.message || error.errors,
      });
    }
  }

 async update(request, response) {
  const schema = Yup.object({
    status: Yup.string().required(),
  });

  try {
    schema.validateSync(request.body, {
      abortEarly: false,
      strict: true,
    });

    const { status } = request.body;
    const {id} = request.params;

    

   
    try{
       await Order.updateOne( {_id: id}, {status});

    } catch (err){
      return response.status(400).json({error: err.message});

    }

    return response.status(200).json({message: "Status updated successfully"});

  } catch (err) {
    return response.status(400).json({
      error: err.errors,
    });
  }
}
async index(_request, response){
  const orders = await Order.find()

  return response.status(200).json(orders);
}
}

export default new OrderController();