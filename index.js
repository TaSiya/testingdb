const express = require('express');
const app = express();
const session = require('express-session');
const pg = require("pg");

const Pool = pg.Pool;


let useSSL = false;
let local = process.env.LOCAL || false;

if (process.env.DATABASE_URL && !local){
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/testingdb';

const pool = new Pool({
    connectionString,
    ssl : useSSL
  });

app.use(function(req, res, next){
    console.log('my middleware');
    let token = req.query.token;
    console.log(req.path);
    if ( req.path !== '/login' && !req.query.token) {
        return res.redirect('/login');
    }
    next();
});


app.get('/login', function(req, res, next) {

    if (req.query.token && req.query.token === '456') {
        return res.redirect("/?token=" + req.query.token)
    }

    // res.send('login');
    next();
});

// app.get('/logout', function() {

// });

app.get('/', async function(req, res, next){
    try{
        let result = await pool.query('select * from users');
        console.log(result.rows);
        res.send(result.rows);
    }
    catch(err){
        return res.status(200).json({
            err,
            stack: err.stack
        });
        //next(err);
    }
    
})

app.listen(3333, function(){
    console.log("Starting at port...."+ 3333);
});