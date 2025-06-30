import psycopg2
from config import host, password
# import your host and password for the pg container 

def create_connection():
    connection = psycopg2.connect(
        user='postgres',
        password=password,
        host=host,
        port='5432',
        database='Inventory_Management'
    )
    return connection

connection = create_connection()
cursor = connection.cursor() 

create_super_admin ='''CREATE TABLE super_admin (
                        id SERIAL PRIMARY KEY,
                        user_name VARCHAR(100) UNIQUE NOT NULL,
                        name VARCHAR(100) NOT NULL,
                        mobile_number VARCHAR NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        role VARCHAR(255) NOT NULL
                    );
                    '''

insert_super_admin = '''INSERT INTO super_admin (user_name, name, mobile_number, email, password, role) 
                        VALUES ('admin_user', 'Ram', '9876543210', 'ram@gmail.com', 'password123', 'super_admin');
                     '''

create_users_table = '''CREATE TABLE users (
                        id SERIAL PRIMARY KEY,
                        user_name VARCHAR(100) UNIQUE NOT NULL,
                        name VARCHAR(100) NOT NULL,
                        mobile_number VARCHAR(15) NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        role VARCHAR(50) NOT NULL,
                    );'''

insert_user = '''INSERT INTO users (user_name, name, mobile_number, email, password, role)
                VALUES ('', 'Ram', '9876543210', 'ram@gmail.com', 'password123', 'super_admin');
                '''

delete = '''DELETE FROM roles
            WHERE role = 'super_admin';'''

# CREATE TABLE Category(
# 	category_id SERIAL PRIMARY KEY,
# 	category_name VARCHAR(255) NOT NULL
# );

# CREATE TABLE SubCategory(
# 	subcategory_id SERIAL PRIMARY KEY,
# 	category_id INT NOT NULL,
# 	subcategory_name VARCHAR(255) NOT NULL,
# 	CONSTRAINT fk_Category
#       FOREIGN KEY(category_id)
#         REFERENCES Category(category_id)
# 		ON DELETE CASCADE
# );

# CREATE TABLE ItemDetails (
#     item_id SERIAL PRIMARY KEY,
#     item_name VARCHAR(100) NOT NULL,
# 	item_price INT NOT NULL,
#     item_category_id INT NOT NULL,
#     item_subcategory_id INT NOT NULL,
#     item_description TEXT,
#     sku VARCHAR(50) UNIQUE NOT NULL,
#     barcode VARCHAR(255),
# 	barcode_url VARCHAR(255) NOT NULL,
# 	item_img_url VARCHAR(255)
#     CONSTRAINT fk_item_category FOREIGN KEY (item_category_id) REFERENCES Category (category_id) ON DELETE CASCADE,
#     CONSTRAINT fk_item_subcategory FOREIGN KEY (item_subcategory_id) REFERENCES SubCategory (subcategory_id) ON DELETE CASCADE
# );

# ALTER TABLE stock ADD CONSTRAINT item_id_unique UNIQUE(item_id);

# select ItemDetails.item_id, ItemDetails.item_name, ItemDetails.sku, stock.current_stock, stock.reorder_level from ItemDetails
# INNER JOIN stock ON ItemDetails.item_id = stock.item_id
# where stock.current_stock <= stock.reorder_level;

# create table stock_transaction(
# transaction_id serial primary key,
# stock_id int REFERENCES stock(stock_id),
# item_id int REFERENCES stock(item_id),
# transaction_type VARCHAR(10) CHECK (transaction_type IN ('IN', 'OUT')),
# quantity INT NOT NULL,
# transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
# remarks TEXT
# );

# select * from users;

# DELETE FROM stock_transaction WHERE transaction_id = 6;

# SELECT * FROM users WHERE role='warehouse_staff';

# UPDATE users SET user_name='temp', name='temp' WHERE id=17;

# select * from ItemDetails;

# select * from stock;
# SELECT current_stock From stock;
# ALTER TABLE stock ADD CONSTRAINT item_id_unique UNIQUE(item_id);

# select ItemDetails.item_id, ItemDetails.item_name, ItemDetails.sku, stock.current_stock, stock.reorder_level from ItemDetails
# INNER JOIN stock ON ItemDetails.item_id = stock.item_id
# where stock.current_stock <= stock.reorder_level;

# CREATE TABLE stock_transactions (
#     transaction_id SERIAL PRIMARY KEY,
#     sku VARCHAR(50),
#     stock_id INT,
#     item_id INT,
#     transaction_type VARCHAR(10) CHECK (transaction_type IN ('IN', 'OUT')),
#     quantity INT NOT NULL,
#     transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#     remarks TEXT,
#     FOREIGN KEY (sku) REFERENCES ItemDetails(sku) ON DELETE CASCADE,
#     FOREIGN KEY (stock_id) REFERENCES stock(stock_id) ON DELETE CASCADE,
#     FOREIGN KEY (item_id) REFERENCES stock(item_id) ON DELETE CASCADE
# );
# select * from stock_transactions;
