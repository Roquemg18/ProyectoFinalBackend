const app  = require('./app')
const{port}= require('./config/app.config')


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})