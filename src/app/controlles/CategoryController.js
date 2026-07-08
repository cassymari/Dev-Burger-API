import * as Yup from 'yup';

import Category from '../models/Category.js';


class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      
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

    

    const { name } = request.body;
    const {filename } = request.file;

    const existingCategory = await Category.findOne({
      where:{
        name,
      
      }
    })

    if(existingCategory){
      return response.status(400).json({ error: 'category already exists'});
    }

   

   await Category.create({
      name,
      path: filename,
    
    });

    return response.status(201).json();
  }

    async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      
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

    

    const { name } = request.body;
    const { id } = request.params;

    let path = category.path;
    if(request.file){
       const {filename } = request.file;
      path = filename;
    }
   
    const existingCategory = await Category.findOne({
      where:{
        name,
      
      }
    })

    if(existingCategory){
      return response.status(400).json({ error: 'category already exists'});
    }

   

   await Category.update({
      name,
      path,
    
    }, {
      where:{
        id
      }
    });

    return response.status(201).json();
  }

  async index(_request, response) {
  try {
    const categories = await Category.findAll();

    return response.status(200).json(categories);
  } catch (error) {
    console.error("ERRO CATEGORY:");
    console.error(error);

    return response.status(500).json({
      message: error.message,
    });
  }
}
}



export default new CategoryController();