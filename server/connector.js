const mongoose = require('mongoose');
const db_link='mongodb+srv://Admin:t4UaVnaztokq36sm@mernuser.mzkelwc.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    // console.log(db)
    console.log("db connected");
})
.catch(function(err){
    console.log(err);
})
