const express = require("express")
const cassandra     = require("cassandra-driver");

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000

const client        = new cassandra.Client({
    contactPoints:[process.env.CASSANDRA_HOST + ':' + process.env.CASSANDRA_PORT],
    localDataCenter: 'datacenter1',
    keyspace: 'prac_keyspace'
});

// required functions.
// ***************************************************************************************** //
var showFullData = async function(table){
    var query1 = `select * from ${table};`;
    try{
        var resultset = await client.execute(query1);
        return resultset;
    } catch (e){
        console.error(e)
        return {
            msg:"hvj",
            err_code:401
        };
    }
}

var insert_into = async function(table, data){
    var query = `insert into ${table} (id, name) values (?, ?);`
    console.log("(40)body-parser input :" + JSON.stringify(data))
    try {
        return await client.execute(query, [data.id_of_user, data.name_of_user], { prepare : true, hints:['int', 'text'] });
    } catch(e) {
        console.error(e);
        return {};
    }
}
// ***************************************************************************************** //



// Routers GET
// ***************************************************************************************** //
app.get('/', (req, res)=>{
    res.send("home");
});

app.get('/insert', (req, res)=>{
    res.send("insert");
});

app.get('/show_data', async (req, res)=>{
    var resultSet = await showFullData('usr');
    console.log(JSON.stringify(resultSet, undefined, 4));
    res.json(resultSet);
});
// ***************************************************************************************** //


// Routers POST
// ***************************************************************************************** //
app.post("/insert", async (req, res)=>{
    await insert_into('usr', req.body);
    res.status(201);
});
// ***************************************************************************************** //

app.listen(PORT, ()=>console.log("server up and running @" + PORT));