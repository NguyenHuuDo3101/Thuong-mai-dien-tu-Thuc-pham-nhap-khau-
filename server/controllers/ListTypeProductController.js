import expressAsyncHandler from 'express-async-handler'
import cloudinary from 'cloudinary'
import { ListTypeProductModel } from '../models/ListTypeProductModel.js'

export const getAllTypeProduct = expressAsyncHandler(async (req, res) => {
    const allType = await ListTypeProductModel.find({})
    res.send(allType)
})

export const createNewTypeProduct = expressAsyncHandler(async (req, res) => {
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "dev_setups",
      });
    const newType = new ListTypeProductModel({
        name: req.body.name,
        img: result.secure_url,
        cloudinary_id: result.public_id,
    }) 

    await newType.save()
    res.send(newType)
})

export const deleteTypeProduct = expressAsyncHandler(async (req, res) => {
    const typeProduct = await ListTypeProductModel.findById({_id: req.params.id})

    await cloudinary.uploader.destroy(typeProduct.cloudinary_id)

    if(typeProduct){
        await typeProduct.remove()
        res.send({msg: 'deleted type product'})
    }else{
        res.send({msg: 'product not found'})
    }

})