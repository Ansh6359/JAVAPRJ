const mongoose = require('mongoose');

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connection has been successfully established!');
}).catch((e) => {
    console.log('Connection failed!!');
})