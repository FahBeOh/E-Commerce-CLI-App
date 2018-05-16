DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (100) NOT NULL,
    depart_name VARCHAR (100) NOT NULL,
    price DECIMAL (8,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, depart_name, price, stock_quantity)
VALUES ("iPhone X", "Electronics", 999.00, 5), 
			   ("Sneakers", "Clothing", 45.00, 1), 
			   ("Hat", "Clothing", 15.00, 10), 
			   ("Bracelet", "Accessories", 10.00, 20), 
               ("Dinning Table", "Furniture", 399, 10), 
               ("Baseball", "Sports", 20.00, 40), 
               ("Basketball", "Sports", 25.00, 40), 
               ("Sunglasses", "Accesories", 50.00, 20), 
               ("Guitar", "Music", 300.00, 5), 
               ("Bongos", "Music", 100.00, 10);

