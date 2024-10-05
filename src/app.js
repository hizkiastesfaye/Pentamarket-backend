require('dotenv').config()
const express = require('express')
const user = require('./features/Users/userRoutes')
const product = require('./features/Products/productRoutes')
const order = require('./features/Orders/orderRoutes')
const cart = require('./features/Carts/cartRoutes')
const inventory = require('./features/Inventory/inventoryRoutes')
const supportTicket = require('./features/SupportTicket/supportRoutes')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.get('/',(req,res)=>{
    res.status(200).send('Welcome to Pentamarket!')
})
app.use('/user',user)
app.use('/product',product)
app.use('/order',order)
app.use('/cart',cart)
app.use('/inventory',inventory)
app.use('/support',supportTicket)

app.use((req,res)=>{
    res.status(404).send('Page not found.')
})

module.exports = app