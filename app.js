const express              = require("express")
const bodyParser           = require("body-parser");

var {showFullData, insert_into} = require("./src/model");

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const keyspace  = "covid_keyspace";
const table     = "covid_table";

// Routers GET
// ***************************************************************************************** //
app.get('/', (req, res)=>{
    res.send("home");
});

app.get('/insert', (req, res)=>{
    res.send("insert");
});

app.get('/show_data', async (req, res)=>{
    var resultSet = await showFullData(keyspace, table);
    console.log(JSON.stringify(resultSet, undefined, 4));
    res.json(resultSet);
});
// ***************************************************************************************** //


// Routers POST
// ***************************************************************************************** //
app.post("/insert", async (req, res)=>{
    await insert_into(keyspace, table, {
        name : req.body.name,
        age : parseInt(req.body.age),
        gender : req.body.gender,
        ph_no : req.body.ph_no.split(','),
        p_status : req.body.p_status.split(','),
        address : JSON.parse(req.body.address)
    });
    res.status(201);
});
// ***************************************************************************************** //

app.listen(PORT, ()=>console.log("server up and running @" + PORT));