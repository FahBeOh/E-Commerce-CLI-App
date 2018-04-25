// Required npm modules
require("dotenv").config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table-redemption');
// Stores mysql connection data into a variable
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});
// Establish connection with msql database & begin script
connection.connect(function (err) {
  if (err) throw err;
  console.log(`
    ==============================
    WELCOME TO MY ESHOP of STUFF!
    ==============================
  `);
  table()
});
// Function that displays a table of available items for purchase
function table() {
  connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
    if (err) throw err;
    // Calls table contructor function from cli-table-redemption module
    var table = new Table({
      head: ['ID', 'Product', 'Price'],
      colWidths: [5, 25, 10]
    });
    // Loops through mysql query and pushes items to table
    for (var i = 0; i < res.length; i++) {
      table.push(
        [res[i].item_id, res[i].product_name, '$' + res[i].price.toFixed(2)],
      );
    }
    console.log(table.toString());
    question()
  })
}
// Function that prompts questions for the user and processes the order
function question() {
  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the ID of the item you would like to purchase.",
      name: "purchase_id",
      validate: function validateId(purchase_id) {
        var reg = /^\d+$/;
        return reg.test(purchase_id) || "Please enter an ID 'NUMBER'";
      }
    },
    {
      type: "input",
      message: "How many units would you like to purchase?",
      name: "purchase_quantity",
      validate: function validateQuantity(purchase_quantity) {
        var reg = /^\d+$/;
        return reg.test(purchase_quantity) || "Please enter an quantity 'NUMBER'";
      }
    }])
// Process order based on user input
    .then(function (response) {
      connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id = " + response.purchase_id, function (err, res) {
        if (err) throw err;
// If user requests quantity higher than what is avaiable, message is printed, and program starts again.
        else if (response.purchase_quantity > res[0].stock_quantity) {
          console.log(`
INSUFFICIENT QUANTITY, PLEASE PLACE ANOTHER ORDER
==================================================
        `);
          setTimeout(start, 3000);
        }
// If order is less than available quantity, verify user to purchase item, complete transaction, update inventory
        else if (response.purchase_quantity <= res[0].stock_quantity && response.purchase_quantity > 0) {
          var total = response.purchase_quantity * res[0].price;
          console.log("Your total is $" + total);
          (function () {
            inquirer.prompt([
              {
                type: "confirm",
                message: "Would you like the proceed with your purchase?",
                name: "confirm",
                default: true
              }])
              .then(function (answer) {
                var finalQuantity = res[0].stock_quantity - response.purchase_quantity;
                connection.query("UPDATE products SET stock_quantity = " + finalQuantity + " WHERE item_id = " + response.purchase_id, function (err, res) {
                  if (err) throw err;
                })
                console.log("CONGRATS ON YOUR PURCHASE!");
                console.log("COME BACK AND SHOP AGAIN SOON!")
                connection.end();
              })
          }())
        }
      })
    });
}
// Function that restarts the script for new order or invalid order quantity
function start() {
  console.log(`
      ==============================
      WELCOME TO MY ESHOP of STUFF!
      ==============================
    `);
  table()
}


