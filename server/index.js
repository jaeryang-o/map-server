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

const router = express.Router();

router.get(
  '/tile/:z/:x/:y.:ext',
  asyncWrapper(async (request, response, next) => {
    try {
      const {z, x, y, ext} = request.params;
      const client = new pg.Client({
        user: POSTGRES_USER,
        host: POSTGRES_HOST,
        password: POSTGRES_PASS,
        database: POSTGRES_DBNAME,
        port: 5432,
      });
      client.connect();

      const result = await client.query(`SELECT buildings(${x},${y},${z});`);
      await client.end();
      const buffer = Buffer.from(result.rows[0].buildings, 'binary');

      response.writeHead(200, {
        'Content-Type': 'application/protobuf',
        'Access-Control-Allow-Origin': '*',
      });
      response.write(buffer, 'binary');
      response.end(null, 'binary');
    } catch (e) {
      console.error(e);
      response.status(500);
      response.send(e);
    }
  })
);

app.use(router);

function asyncWrapper(asyncFn) {
  return (async (req, res, next) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  });
}

app.listen(
  PORT,
  () => console.log(`Example app listening at http://localhost:${PORT}`)
);
