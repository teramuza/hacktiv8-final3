
# Hacktiv8 Final Project 3

Pada final project kali ini kami membuat aplikasi Toko Belanja, yang dimana pada aplikasi ini terdapat akan ada seorang admin dan banyak customer. Yang memiliki wewenang untuk melakukan proses CRUD terhadap category dan product hanyalah admin saja. Sedangkan customer hanya bisa melakukan proses pembelian product dan melihat data transaksi pembeliannya. Customer juga dapat melakuan top-up saldo untuk menambahkan saldonya.


## Run Locally

Clone the project

```bash
  git clone https://github.com/teramuza/hacktiv8-final3.git
```

Go to the project directory

```bash
  cd hacktiv8-final3
```

Install dependencies

```bash
  yarn install
```

Migrate Database
```bash
  sequelize db:migrate
```
> you must create `.env` file and DB first and fill `DB_DATABASE` on your `.env` file

Start the server

```bash
  yarn start
```

Start the server as dev mode

```bash
  yarn serve
```



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Env Key | Description |
|---|---|
|`APP_PORT`| your app running port|
|`DB_HOST` | your database host running |
|`DB_DIALECT` | your database dialect (e.g: `postgres`) |
|`DB_USERNAME` | your database username |
|`DB_PASSWORD` | your database user password |
|`DB_DATABASE` | your database name |
|`JWT_SECRET_KEY` |you can generate your own `JWT_SECRET_KEY` |
|`DEV_MODE` | dev mode is useful for enabling logging and configuration for the deployment process (`true` or `false`)|



## API Reference

- You can see our collection (postman) [here](https://www.getpostman.com/collections/fbe2433f6c4d0a2f6c38)
- You can see our documentation (postman) [here](https://documenter.getpostman.com/view/14129982/UVXqDsEV)

## Deployment

- You can access our endpoints with endpoint : `https://hacktiv8-final3.herokuapp.com/api/v1/`
