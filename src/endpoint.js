const express = require("express");
const app = express();

const cookieparser = require('cookie-parser');
var bodyParser = require('body-parser')
const cors = require('cors');
const port = process.env.PORT || 3003;

//MiddleWares
app.use(bodyParser.json())
app.use(cookieparser());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
  }));

app.get('/',(req,res,next)=>{
    res.json({
        'jtf-lib': "server-running"
    })
})

//Listening on 8081
app.listen(port, () => {
    console.log(`app is running on ${port}`);
});