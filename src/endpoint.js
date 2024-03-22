
const runserver = ( port=3003 ) => {
    //
    port = (process.env.PORT) ? process.env.PORT : port;
    
    const express = require("express");
    const app = express();

    const cookieparser = require('cookie-parser');
    var bodyParser = require('body-parser')
    const cors = require('cors');
    const routes = require("./routes/routes.js"); 
    
    //MiddleWares
    app.use(bodyParser.json({limit:'500kb'}));
    app.use(cookieparser());
    app.use(cors({
        origin: '*',
        optionsSuccessStatus: 200
      }));
    app.use('/jtf-lib/api', routes);
    app.get('/',(req,res)=>{
        res.json({
            'jtf-lib': "server-running"
        });
    });

    //Listening on port
    app.listen(port, () => {
        console.log(`jtf-lib endpoint is running on ${port}`);
    });
};

//module.exports.app = app;
module.exports.runserver = runserver;
