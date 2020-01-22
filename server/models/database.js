const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/proteins';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
 //'CREATE TABLE pwdt(id SERIAL PRIMARY KEY, swiss_prot_id VARCHAR(40), gene_name_query VARCHAR(40), gene_name VARCHAR(40), entry_name VARCHAR(40), protein_name VARCHAR(100), identified VARCHAR(40), quantified VARCHAR(40), good_linearity VARCHAR(40), broader_linear_range VARCHAR(40), length INTEGER, sequence VARCHAR(9000))');
 //"COPY pwdt(id, swiss_prot_id, gene_name_query, gene_name, entry_name, protein_name, identified, quantified, good_linearity, broader_linear_range, length, sequence) FROM 'C:/Users/HuangL3/Documents/decision_tree_db.csv' WITH(DELIMITER ',', FORMAT CSV, HEADER);");
 
 //'CREATE TABLE peptides(id SERIAL PRIMARY KEY, swiss_prot_id VARCHAR(40), entry_name VARCHAR(40), peptide VARCHAR(100), modified_peptide VARCHAR(100), modification VARCHAR(100))');
 //"COPY peptides(id, swiss_prot_id, entry_name, peptide, modified_peptide, modification) FROM '/Users/huangl3/Documents/PlasmaPilot/peptide_files/decision_tree_peptides_filtered.csv' WITH(DELIMITER ',', FORMAT CSV, HEADER);");
query.on('end', () => { client.end(); });
query.on('end', () => { client.end(); });