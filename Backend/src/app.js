const express = require("express")
const cors = require('cors')
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const userRoutes=require("./routes/userRoutes")
const app= express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.get("/", (req, res) => {
  res.send("Student E-Library API is running 🚀");
});

app.use('/api/auth',authRoutes)
app.use("/api/books",bookRoutes)
app.use("/api/users",userRoutes)
module.exports = app