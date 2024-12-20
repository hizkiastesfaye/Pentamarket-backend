
const userModel = require('./userModel')
const bcrypt = require('bcrypt')
const { validationResult} = require('express-validator')
const authMiddleware = require('../../middleware/authMiddleware')


exports.registerUser = async (req)=>{
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join(', ');
        throw new Error(errorMessages);
    }
    const user = req.body;
    const isuser = await userModel.User.findOne({email:user.email})
    if (isuser) {
        throw new Error('Email is already exists')
    }
    const roles = ['Buyer','Seller','admin']
    
    if(user.role && !roles.includes(user.role)) {
        throw new Error('invalid roles')
    }
    if(!user.role) user.role = 'Buyer';

    const hashedpassword = await bcrypt.hashSync(user.password,10)
    const newuser = new userModel.User({
        firstname:user.firstname,
        lastname:user.lastname,
        country: user.country,
        tel:user.tel,
        email:user.email,
        role:user.role,
        password:hashedpassword
    })
    
    return await newuser.save()
}


exports.loginUser = async (req)=>{
    const err = validationResult(req)
    if (!err.isEmpty()){
        const errorMessages = err.array().map(error=>error.msg).join(', ');
        throw new Error(errorMessages);
    }
    const user = await userModel.User.findOne({email:req.body.email})
    if (!user){
        throw new Error('Incorrect Email')
    }
    const ispassword = bcrypt.compareSync(req.body.password,user.password)
    if (!ispassword){
        throw new Error('Incorrect password')
    }

    const token = authMiddleware.jwtAuth(user.firstname,user.email,user.role)

    return {firstname:user.firstname,token:token,role:user.role}
}

exports.updateUser = async (req)=>{
    const param1 = req.params.field1
    const param2 = req.params.field2
    const err = validationResult(req)
    if(!err.isEmpty()) {
        const errorMessages = err.array().map(error=>error.msg).join(', ')
        throw new Error(errorMessages)
    }
    const user =  await userModel.User.findOne({email: req.user.email})
    if (!user){
        throw new Error('user not found.')
    }
        if(param2 == 'lastname'){
            user.firstname=req.body.firstname
            user.lastname = req.body.lastname
            const token = authMiddleware.jwtAuth(user.firstname,user.email,user.role);
            await user.save()
            return {msg:'succussfully updated', token}
        }
        else if (param1 == 'password'){
            if(bcrypt.compareSync(req.body.password,user.password)){
                const hashedpassword = bcrypt.hashSync(req.body.newPassword,10)
                user.password = hashedpassword
                // console.log('-------------------',user,req.body.password,req.body.newPassword)
                return await user.save()
            }
            else{
                throw new Error('old password is incorrect')
            }
        }
        else if(param1 == 'address'){
            const userAddress = new userModel.Address({
                user_id:user._id,
                state: req.body.state,
                city: req.body.city,
                street: req.body.street,
                zipcode:req.body.zipcode

            })
            return await userAddress.save()

        }
        else if(param1 == 'role'){
            const roles = ['Buyer','Seller','admin']
    
            if(!roles.includes(user.role)) {
                throw new Error('invalid role')
            }
            user.role = req.body.role
            const token = authMiddleware.jwtAuth(user.firstname,user.email,user.role);
            await user.save()
            return {user, token}

        }
        else if(param1 == 'email') {
            user[param1] = req.body[param1]
            const token = authMiddleware.jwtAuth(user.firstname,user.email,user.role);
            await user.save()
            return {user, token}
        }
        else{
            user[param1] = req.body[param1]
            if(param1 == 'email') {
                const token = authMiddleware.jwtAuth(user.firstname,user.email,user.role);
                await user.save()
                return {user, token}
            }
            return await user.save()
        }
        
}

exports.getUser = async (req)=>{
    const userEmail = req.user.email
    const user = await userModel.User.findOne({email:userEmail})
    console.log(req.user)
    return{
        firstname:user.firstname,
        lastname:user.lastname,
        country:user.country,
        tel:user.tel,
        email:user.email, 
        role:user.role
    }
}


exports.deleteUser=async (req)=>{
    const deleteduser = await userModel.User.findOneAndDelete({email:req.params.email})
    if (!deleteduser) {
        throw new Error('email not found')
    }
    await userModel.Address.findOneAndDelete({user_id:deleteduser._id})
    return({msg:'successfuly deleted'})
}