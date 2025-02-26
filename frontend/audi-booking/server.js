const exp = require("express");
const app = exp();

require('dotenv').config()
const port=process.env.PORT||4000;
app.listen(port, () => console.log("server listening on port 4000..."));
const path=require("path")
app.use(exp.static(path.join(__dirname,'./build')))


const mclient=require("mongodb").MongoClient;
// 'mongodb://127.0.0.1:27017/cbpdemo'
mclient.connect(process.env.MONGO_CONNECT_URI)
.then(dbRef=>{
  let dbObj=dbRef.db('cbpdemo')

  let AudiCollection=dbObj.collection("AddAudi")
  let availablecollection=dbObj.collection("audiavailability")
  let userCollection=dbObj.collection("usercollection")
  app.set("userCollection",userCollection)
  app.set("AddAudi",AudiCollection)
  app.set("audiavailability",availablecollection)
 

  console.log("Connected to DB successfully")
})
.catch(err=>console.log("database connection err is ",err))
const userApp = require("./APIS/ConsumerHome");
const AddAudiApp = require("./APIS/AdminHome");


app.use("/ConsumerHome-api", userApp);
app.use("/AdminHome-api",AddAudiApp);




const pageRefresh=(request,response,next)=>{
  response.sendFile(path.join(__dirname,'./build/index.html'))
}
app.use("*",pageRefresh)




const invalidPathHandlingMiddleware = (request, response, next) => {
  response.send({ message: "Invalid path" });
};

app.use(invalidPathHandlingMiddleware);


const errHandler = (error, request, response, next) => {
  response.send({ "error-message": error.message });
};
app.use(errHandler);
