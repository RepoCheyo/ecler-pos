const initFuncs = {
  dbInit: 'ecler.db',
  customersInit:
    'CREATE TABLE IF NOT EXISTS customers ( cust_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT )',
  paymentsInit:
    'CREATE TABLE IF NOT EXISTS accounts ( acc_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, amount INTEGER )',
  stockInit:
    'CREATE TABLE IF NOT EXISTS stock ( prod_id TEXT PRIMARY KEY, name TEXT, option TEXT, price TEXT )',
  flavorsInit:
    'CREATE TABLE IF NOT EXISTS flavors ( flavor_id TEXT PRIMARY KEY, prod_id TEXT NOT NULL, name TEXT, qty INTEGER, FOREIGN KEY (prod_id) REFERENCES stock (prod_id) ON DELETE CASCADE )',
  saleInit:
    'CREATE TABLE IF NOT EXISTS sales ( sale_id TEXT PRIMARY KEY, cust_name TEXT, sale_det TEXT, amount INTEGER, account TEXT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (cust_name) REFERENCES customers (name) )',
  expensesInit:
    'CREATE TABLE IF NOT EXISTS expenses ( expense_id TEXT PRIMARY KEY, title TEXT, amount INTEGER, desc TEXT, account TEXT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP )',
};

module.exports = {
  initFuncs,
};
