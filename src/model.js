const cassandra_driver     = require("cassandra-driver");

const Client = cassandra_driver.Client
const uuid = cassandra_driver.types.Uuid

require('dotenv').config();

// ***************************************************************************************** //
const client = new Client({
    cloud: { secureConnectBundle: './secure-connect-covid-table.zip' },
    credentials: { username: process.env.CASSANDRA_USER, password: process.env.CASSANDRA_PASS }
});

client.connect();
// ***************************************************************************************** //

module.exports.showFullData = async function(keyspace, table){
    var query1 = `select * from ${keyspace}.${table};`;
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

module.exports.insert_into = async function(keyspace, table, data){
    var query = `insert into ${keyspace}.${table} (id, name, age, gender, ph_no, p_status, address) values (?, ?, ?, ?, ?, ?, ?);`
    try {
        return await client.execute(query, [uuid.random(), data.name, data.age, data.gender, data.ph_no, data.p_status, data.address], { prepare : true, hints:['uuid', 'text', 'int', 'text', 'set', 'list', 'map'] });
    } catch(e) {
        console.error(e);
        return {};
    }
}