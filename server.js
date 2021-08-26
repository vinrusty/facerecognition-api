const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const cors = require('cors')
const app = express()
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'smartbrainapi'
    }
})

// db.select().from('users').then(data=>{
//     console.log(data);
// });

app.use(bodyParser.json()) //middleware and how does bodyparser work?
app.use(cors())

app.post('/signin', (req, res)=>{signin.handleSignin(req,res,db,bcrypt)})

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)})

app.get('/profile/:id', (req,res) => {
    const {id} = req.params
    db.select().from('users').where({
        id: id
    }).then(user=>{
        if(user.length){
            res.json(user[0]);
        }
        else{
            res.status(400).json('user not found');
        }
    }).catch(err => res.status(400).json('error getting the user'))
})

app.put('/image', (req,res) => {
    const {id} = req.body
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries=>res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
})

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000,()=>{
    console.log('the server is running!')
})