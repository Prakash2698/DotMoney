const express = require('express'); 
const app = express();
const PORT = 7000;
require('./config/connection');

const cors = require("cors");
app.use(cors());
// app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// ==============user route =======================
const Router = require("./router/user/user");
app.use(Router); 

// =============== admin route ====================
const AdminRouter = require("./router/admin/addPlan");
app.use(AdminRouter);

app.listen(PORT,()=>{
    console.log("Server started on 7000");
});