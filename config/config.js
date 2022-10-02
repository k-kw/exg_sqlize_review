module.exports = {
  'development': {
    'username': "root",
    'password': null,
    'database': "database_development",
    'host': "127.0.0.1",
    'port': '3306',
    'dialect': 'mysql',
    'operatorsAliases': false,
  },
  "test": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    'port': '3306',
    'dialect': 'mysql',
    'operatorsAliases': false,
  },
  "production": {
    "username": process.env.DATABASE_USER,
    "password": process.env.DATABASE_PASSWORD,
    "database": process.env.DATABASE_NAME,
    "host": process.env.DATABASE_HOST,
    'port': '3306',
    'dialect': 'mysql',
    'operatorsAliases': false,
  }
};