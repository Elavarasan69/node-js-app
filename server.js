let express = require('express')
//database connection
let mongodb = require('mongodb')

let app = express()
//database name 
let db = null

//add external files out of folder
app.use(express.static('public'))
let port = process.env.PORT
if(port == null || port ==""){
  port = 3000
}
//mongo db client
const MongoClient = mongodb.MongoClient;
//db connection

//connect(secret value) - get it from mongodb
//connect(secret value, {useNewUrlParser:true}) - basic value 
//connect(secret value, {useNewUrlParser:true}, function(err,client){ })

let dbConnection = 'mongodb+srv://elavarasanrobosoft:Dhg5OgGntd2adInd@democluster.demxysx.mongodb.net/Notes?retryWrites=true&w=majority'
let dbname = 'Notes'

MongoClient.connect(dbConnection ,{useNewUrlParser:true,useUnifiedTopology:true}, function(err,client){
  if(err){
    throw err;
  } 
  db = client.db(dbname)
  app.listen(port)
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//securing the application
function passProtected(request, response, next){
response.set('WWW-Authenticate','Basic realm="Todo App"')
if(request.headers.authorization == 'Basic aWQ6cGFzc3dvcmQ='){
  next()
}else{
  response.status(401).send("please prove id password")
}
}
app.use(passProtected)


app.get('/', function(request,response){

  //getting data from database
  db.collection('data').find().toArray(function(err,items){
    // console.log(items)
    response.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-do App</h1>
        <div class="jumbotron p-3 shadow-sm">
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div
        <ul class="list-group pb-5">
        ${//displaying the data form ddatabase
          items.map(function(item){
          return `
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button  data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button  data-id=${item._id} class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
        }).join('')}
        </ul>
      </div>

      <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
      <script src ="/browser.js"></script>
    </body>
    </html>
    `)
  })
})

app.post('/create-item',function(request,response){
    //adding data to the ddatabase
    //insertOne(value to be inserted,  anonynous function)
    db.collection('data').insertOne({text:request.body.item},function(){
      console.log({text:request.body.item})
      // response.send("data is sent")
      response.redirect('/')
    })
})

app.post('/update-item',function(request,response){
// console.log(request.body.result)

  //findOneAndUpdate(create new id for updated data, value to bechanget,annonymous function())
  db.collection('data').findOneAndUpdate({_id: new mongodb.ObjectId(request.body.id)},{$set:{text:request.body.text}}, function(){
    response.send("data updated")
  })
})


app.post('/delete-item',function(request,response){
  // console.log(request.body.result)
  
    //findOneAndUpdate(create new id for updated data, value to bechanget,annonymous function())
    db.collection('data').deleteOne({_id: new mongodb.ObjectId(request.body.id)},function(){
      response.send("data deleleted")
    })
  })

//Export the express api
module.exports = app

