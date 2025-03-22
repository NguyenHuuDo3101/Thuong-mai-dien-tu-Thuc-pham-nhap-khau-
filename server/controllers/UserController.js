import {UserModel} from '../models/UserModel.js'
import {generateToken} from '../untils/until.js'
import expressAsyncHandler from 'express-async-handler'

export const getAllUser = (req, res) => {
    UserModel.find({})
        .then(user => res.send(user))
        .catch(err => console.log(err))
}

export const registerUser = expressAsyncHandler(async (req, res) => {
    const user = new UserModel({
        // _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: '',
        phone: '',
        isAdmin: false,
    })
    const createUser = user.save();
    res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        address: user.address ,
        phone: user.phone,
        token: generateToken(user),
    });
})

export const login = expressAsyncHandler(async (req, res) => {
    const user = await  UserModel.findOne({email: req.body.email, password: req.body.password})
    if(user){ 
        res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            address: user.address ,
            phone: user.phone,
            isAdmin: user.isAdmin,
            token: generateToken(user),
        });
    }else{
        res.status(401).send({message: "invalid email or password"})
    }
})

export const DeleteUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById({_id: req.params.id})

    if(user){
        await user.remove()
        res.send({message: 'user deleted'})
    }else{
        res.send({message: 'user not exists'})
    }
})
export const updateProfile = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id); // Tìm user dựa trên ID đã xác thực
    if (user) {
        user.name = req.body.name || user.name; // Cập nhật tên nếu có
        user.email = req.body.email || user.email; // Cập nhật email nếu có
        user.phone = req.body.phone || user.phone; // Cập nhật số điện thoại nếu có
        user.address = req.body.address || user.address; // Cập nhật địa chỉ nếu có

        // Lưu các thay đổi vào database
        const updatedUser = await user.save();

        // Trả về thông tin người dùng đã cập nhật kèm theo token
        res.send({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser), // Tạo lại token với thông tin mới
        });
    } else {
        res.status(404).send({ message: 'User not found' });
    }
});
