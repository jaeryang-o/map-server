const express = require('express');
const morgan = require('morgan');
const pg = require('pg');

const PORT = 8080;
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const POSTGRES_PASS = process.env.POSTGRES_PASS || 'postgres';
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
const POSTGRES_DBNAME = process.env.POSTGRES_DBNAME || 'osmdata';

const app = express();

app.use(morgan('tiny'));

app.get('/tile/:z/:x/:y.:ext', async (request, response) => {
  try {
    // const { z, x, y, ext } = request.params;
    // const client = new pg.Client({
    //   user: POSTGRES_USER,
    //   host: POSTGRES_HOST,
    //   password: POSTGRES_PASS,
    //   database: POSTGRES_DBNAME,
    //   port: 5432,
    // });
    // client.connect();

    // let result;
    // const buffers = [];
    // const tables = ['buildings', 'electricvehiclechargingstation'];

    // for (let i = 1; i < tables.length; i += 1) {
    //   const table = tables[i];
    //   result = await client.query(`SELECT ${table}(${x},${y},${z});`);
    //   buffers.push(Buffer.from(result.rows[0][table], 'binary'));
    // }

    // await client.end();

    // response.writeHead(200, {
    //   'Content-Type': 'application/protobuf',
    //   'Access-Control-Allow-Origin': '*',
    // });
    // response.write(Buffer.concat(buffers), 'binary');
    // response.end(null, 'binary');
    
    console.log("express try!");
    
  } catch (e) {
    console.error(e);
    response.status(500);
    response.send(e);
    
    console.log("express catch!");
    
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

