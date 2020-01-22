const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/proteins';

router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', '..', 'views', 'pages', 'index.ejs'));
});

router.get('/peptide', (req, res, next) => {
  res.render(path.join(
    __dirname, '..', '..', 'views', 'pages', 'peptide.ejs'));
});

router.get('/help', (req, res, next) => {
  res.render(path.join(
    __dirname, '..', '..', 'views', 'pages', 'help.ejs'));
});

router.get('/about', (req, res, next) => {
  res.render(path.join(
    __dirname, '..', '..', 'views', 'pages', 'about.ejs'));
});

router.get('/methodology', (req, res, next) => {
  res.render(path.join(
    __dirname, '..', '..', 'views', 'pages', 'methodology.ejs'));
});

router.get('/abundant', (req, res, next) => {
  res.render(path.join(
    __dirname, '..', '..', 'views', 'pages', 'abundantProteins.ejs'));
});

//Ids not in database
router.get('/api/v1/except/:swiss_prot_id', (req, res, next) => {
  console.log("querying ids not in table");
  const results = [];
  // Grab data from the URL parameters
  var id = req.params.swiss_prot_id;
  console.log(req.params);
  console.log(id);
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM unnest($1::text[]) EXCEPT (SELECT swiss_prot_id AS column FROM pwdt UNION SELECT gene_name_query FROM pwdt)', [id.split(',')]);
    // Stream results back one row at a time  
    query.on('row', (row) => {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


//Query ids
router.get('/api/v1/query/:id', (req, res, next) => {
  console.log("querying ids")
  const results = [];
  // Grab data from the URL parameters
  var id = req.params.id;
  console.log(req.params);
  console.log(id);
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query(';with C as (SELECT * FROM unnest($1::text[]) WITH ordinality As f(query, sort_order) JOIN pwdt ON f.query = pwdt.swiss_prot_id OR f.query = pwdt.gene_name_query) SELECT MIN(C.sort_order) AS sort_order, C.swiss_prot_id, C.gene_name, C.entry_name, C.protein_name, C.identified, C.quantified, C.good_linearity, C.broader_linear_range, C.length, C.sequence FROM C GROUP BY C.swiss_prot_id, C.gene_name, C.entry_name, C.protein_name, C.identified, C.quantified, C.good_linearity, C.broader_linear_range, C.length, C.sequence ORDER BY sort_order', [id.split(',')]);
    // Stream results back one row at a time  ORDER BY swiss_prot_id ASC
    query.on('row', (row) => {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

//Query protein sequence
router.get('/api/v1/peptide/:id', (req, res, next) => {
  console.log("querying peptides")
  const results = [];
  // Grab data from the URL parameters
  var id = req.params.id;
  console.log(req.params);
  console.log(id);
  
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM peptides WHERE swiss_prot_id=($1)', [id]);
    //const query = client.query(';with C as (SELECT * FROM unnest($1::text[]) WITH ordinality As f(query, sort_order) JOIN pwdt ON f.query = pwdt.swiss_prot_id OR f.query = pwdt.gene_name_query) SELECT MIN(C.sort_order) AS sort_order, C.swiss_prot_id, C.gene_name, C.entry_name, C.protein_name, C.identified, C.quantified, C.good_linearity, C.broader_linear_range, C.length, C.sequence FROM C GROUP BY C.swiss_prot_id, C.gene_name, C.entry_name, C.protein_name, C.identified, C.quantified, C.good_linearity, C.broader_linear_range, C.length, C.sequence ORDER BY sort_order', [id.split(',')]);
    // Stream results back one row at a time  ORDER BY swiss_prot_id ASC
    query.on('row', (row) => {
      results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

module.exports = router;