const { body,param } = require('express-validator')

const userRegisterValidate = ()=>{
    return [
        body('firstname').notEmpty().withMessage('first name is required'),
        body('lastname').notEmpty().withMessage('lastname is required'),
        body('country').notEmpty().withMessage('country is required'),
        body('tel').notEmpty().withMessage('tel is required'),
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').isLength({min:8}).withMessage('Password must be at least 8 character long.'),

    ]
}

const userUpdateValidate = ()=>{
    const paramsList = ['firstname','email','tel','password','role','country','address']
    return [
        param('field1').custom((value,{req})=>{
            if (paramsList.includes(value)) {
                if(value == 'firstname' && !req.params.field2){
                    throw new Error('field2 is required after firstname')
                }
                return true;
            }
            throw new Error('Invalid field')
        }),
        param('field2').optional().custom((value,{req})=>{
            if (req.params.field1 == 'firstname' && value == 'lastname') return true;
            throw new Error('field1 should be firstname before lastname field')
        }),
        body('firstname').if((value,{req})=> req.params.field1 == 'firstname').notEmpty().withMessage('firstname is required'),
        body('lastname').if((value,{req})=>req.params.field2 =='lastname' && req.params.field1 == 'firstname').notEmpty().withMessage('lastname is required'),
        body('country').if((value,{req})=>req.params.field1 == 'country').notEmpty().withMessage('country is required'),
        body('tel').if((value,{req})=>req.params.field1 == 'tel').notEmpty().withMessage('tel is required'),
        body('email').if((value,{req})=>req.params.field1 == 'email').isEmail().withMessage('Email is invalid'),
        body('role').if((value,{req})=> req.params.field1 == 'role').notEmpty().withMessage('role is required'),
        body('password').if((value,{req})=>req.params.field1 == 'password').isLength({min:8}).withMessage('Password must be at least 8 character long.'),
        // body('address').if((value,{req})=>req.params.field1 == 'address').notEmpty().withMessage('a')
    ]
}

const userLoginvalidate = ()=>{
    return [
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').isLength({min:8}).withMessage('Password must be at least 8 character long.'),
    ]
}

const productCatagoryValidate = ()=>{
    return [
        body('name').notEmpty().withMessage('name is required'),
        body('description').notEmpty().withMessage('description is required')
    ]
}

const productValidate = ()=>{
    return[
        body('name').notEmpty().withMessage('name is required'),
        body('sku').notEmpty().withMessage('sku is required'),
        body('description').notEmpty().withMessage('description is required'),
        body('catagory').notEmpty().withMessage('catagory name is required'),
        body('stockLevel')
            .notEmpty().withMessage('stockLevel is required')
            .isNumeric().withMessage('stockLevel must be number')
    ]
}
const addInventoryValidate = ()=>{
    return[
        body('productSku').notEmpty().withMessage('productSku is required'),
        body('invSku').notEmpty().withMessage('invSku is required'),
        body('invStockLevel')
            .notEmpty().withMessage('invStockLevel is required,')
            .isNumeric().withMessage('invStockLevel must be number'),
        body('price')
            .notEmpty().withMessage('price is required,')
            .isNumeric().withMessage('price must be number'),

        body('location').notEmpty().withMessage('location is required'),
    ]
}

const updateInventoryValidate = ()=>{
    return[
        param('productSku').custom((value,{req})=>{
            if (value) return true;
        }),
        param('invSku').custom((value,{req})=>{
            if(value) return true;
        }),
        body('productSku').notEmpty().withMessage('product sku is required'),
        body('invSku').notEmpty().withMessage('inventory sku is required'),
        body('invStockLevel')
            .notEmpty().withMessage('inventory stockLevel is required')
            .isNumeric().withMessage('inventory stockLevel must be number'),
        body('price')
            .notEmpty().withMessage('price is required')
            .isNumeric().withMessage('price must be number'),

        body('location').notEmpty().withMessage('location is required'),
    ]
}


const cartValidate = ()=>{
    return [
        body('sellerProductId').notEmpty().withMessage('sellerProductId is required'),
        body('quantity').isNumeric().withMessage('quantity must be number'),

    ]
}
const orderValidate = ()=>{
    return [
        body('sellerProductId').notEmpty().withMessage('sellerProductId is required'),
        body('quantity').isNumeric().withMessage('quantity must be number'),

    ]
}

module.exports ={ 
    userRegisterValidate, userUpdateValidate, userLoginvalidate,
    productCatagoryValidate, productValidate,
    addInventoryValidate,updateInventoryValidate,
    cartValidate,orderValidate,
} 


