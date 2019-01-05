const express=require('express')
const appConfig=require('./config/appConfig')
const fs =require('fs')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const globalErrorMiddleware=require('./middlewares/appErrorHandler')
const routeLoggerMiddleware=require('./middlewares/routeLogger')

const app=express()


//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(globalErrorMiddleware.globalErrorHandler)
app.use(routeLoggerMiddleware.logIp)

let modelsPath='./models'
fs.readdirSync(modelsPath).forEach(function(file){
    if(~file.indexOf('.js')){
        console.log("including the following file");
        console.log(modelsPath+'/'+file)

        require(modelsPath+'/'+file)
        
    }
}

)


let routesPath='./routes'

fs.readdirSync(routesPath).forEach(function(file){
    if(~file.indexOf('.js')){
        console.log("including the following file");
        console.log(routesPath+'/'+file)

        let route=require(routesPath+'/'+file)
        route.setRouter(app);
    }
}

)

app.use(globalErrorMiddleware.globalNotFoundHandler)




app.listen(appConfig.port,()=>{
console.log('Example app listening on port 3000');

let db=mongoose.connect(appConfig.db.uri,{
    useMongoClient:true});
})

//handling mongoose connection error
mongoose.connection.on('error',function(err){
    console.log('database connection error');
    console.log(err);
});

//handling mongoose success event
mongoose.connection.on('open',function(err){
    if(err){
        console.log("database error");
        console.log(err);
    }
    else{
        console.log("database connection open success");
    }
});