const express = require('express');
const connectDB = require('./config/db.js');
const app = express();

//Connecting Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/comments', require('./routes/api/comments'));
app.use('/api/blogposts', require('./routes/api/blogposts'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});