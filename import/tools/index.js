#!/usr/bin/env node

const yargs = require('yargs');
const pg = require('pg');
const Papa = require('papaparse');
const YAML = require('yaml');
const Mustache = require('mustache');
const {
  getPath,
  readFile,
  writeFile,
  convertEucKrToUtf8,
} = require('./utils');

const argv = yargs
  .usage('Usage: $0 <cmd> [options]') //
  .command('decoding', 'decode file') // describe commands available.// usage string of application.
  .command('import', 'import file') // describe commands available.// usage string of application.
  .option('input', { // document options.
    string: true,
    description: 'path for input',
    alias: 'i'
  })
  .option('output', { // document options.
    string: true,
    description: 'path for output',
    alias: 'o'
  })
  .option('host', { // document options.
    string: true,
    default: 'localhost',
    description: 'host for input',
    alias: 'h'
  })
  .option('port', { // document options.
    number: true,
    default: 5432,
    description: 'port for input',
    alias: 'p'
  })
  .option('user', { // document options.
    string: true,
    default: 'postgres',
    description: 'user for input',
    alias: 'u'
  })
  .option('password', { // document options.
    string: true,
    default: 'postgres',
    description: 'password for input',
    alias: 'pw'
  })
  .option('dbname', { // document options.
    string: true,
    default: 'osmdata',
    description: 'dbname for input',
    alias: 'n'
  })
  .option('mapping', { // document options.
    string: true,
    default: 'mapping.yml',
    description: 'mapping for input',
    alias: 'm'
  })
  .option('help', {
    description: 'display help message'
  })
  .help('help')
  // show examples of application in action.
  .example('decoding -i test.csv -o test_utf.csv', 'decode ecu-kr to utf8')
  .example('import -i test.csv', 'import csv')
  // final message to display when successful.
  .epilog('job is successfully finished.')
  // disable showing help on failures, provide a final message
  // to display for errors.
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help')
  .argv;

switch (argv._[0]) {
  case 'decoding':
    decoding(argv);
    break;
  case 'import':
    importCSV(argv);
    break;
  default:
    console.log('Unsupported Command');
}

function decoding(argv) {
  const inputPath = getPath(argv.input);
  const outputPath = getPath(argv.output);
  const content = convertEucKrToUtf8(readFile(inputPath));
  writeFile(outputPath, content);
}

async function importCSV(argv) {
  const dataFile = readFile(getPath(argv.input)).toString();
  const mappingFile = readFile(getPath('mapping.yml')).toString();
  const POSTGRES_USER = argv.user;
  const POSTGRES_PASS = argv.password;
  const POSTGRES_HOST = argv.host;
  const POSTGRES_PORT = argv.port;
  const POSTGRES_DBNAME = argv.dbname;

  const data = Papa.parse(
    dataFile,
    {
      header: true,
      newline: '\r\n',
      delimiter: ',',
      skipEmptyLines: true,
    }
  ).data;
  const mapping = YAML.parse(mappingFile);
  const table = mapping.table.name;
  const columns = mapping.columns;

  // console.log(JSON.stringify(mapping, null, 2), table);

  const insertValues = data
    .map((row) => {
      return '(' +
        Object
          .keys(columns)
          .map(
            key => {
              let column;
              const type = columns[key].type;
              const custom = !!columns[key].custom;

              if (custom) {
                column = Mustache.render(columns[key].value, row);
              } else {
                column = row[key];
                if (type === 'numeric') {
                  const col = parseInt(column, 10)
                  column = !Number.isNaN(col) ? col : 0;
                } else {
                  column = `'${column}'`;
                }
              }

              return column;
            },
            ''
          ).join(',') +
        ')';
    }).join(',\n');

  const createQuery = `CREATE TABLE public.${table} (
      id serial primary key,
      ${Object
      .keys(columns)
      .map(key => `${columns[key].name} ${columns[key].type}`)
      .join(',\n')}
    );`

  const insertQuery = `INSERT INTO public.${table} (
      ${Object
      .keys(columns)
      .map(key => columns[key].name)
      .join(',\n')}
      ) VALUES
      ${insertValues};`;

  const client = new pg.Client({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    password: POSTGRES_PASS,
    database: POSTGRES_DBNAME,
    port: POSTGRES_PORT,
  });
  client.connect();

  await client.query(
    `DROP TABLE IF EXISTS public.${table};`
  );
  await client.query(createQuery);
  await client.query(insertQuery);
  await client.end();
}
