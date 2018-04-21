require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table-redemption');

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(function (err) {
  if (err) throw err;

  console.log(`
    ==============================
    WELCOME TO MY ESHOP of STUFF!
    ==============================
  `);

  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;

    var table = new Table({
      head: ['ID', 'Product', 'Price'],
      colWidths: [5, 25, 10]
    });

    for (var i = 0; i < res.length; i++) {
      // table is an Array, so you can `push`, `unshift`, `splice` and friends 
      table.push(
        [res[i].item_id, res[i].product_name, '$'+ res[i].price.toFixed(2)],
      );
    }
    console.log(table.toString());
    connection.end();
  })
});


