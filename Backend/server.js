require("dotenv").config()
const app = require("./src/app")
const connectDB = require("./src/config/db")
connectDB()
const fs = require('fs');

// Auto create uploads folder
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
const PORT =process.env.PORT
app.listen(PORT,()=>{
    console.log("server is ready")
})