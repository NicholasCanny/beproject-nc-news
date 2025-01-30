<!--
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/) --> -->

The API is hosted at:

https://nicholascannybackendproject.onrender.com/api/

Project Overview:

This project involved building an API that enables programmatic access to data.
It was designed to simulate a real-world backend service, such as Reddit, to
provide information to a frontend environment.

The database consisted of multiple tables containing a variety of information,
which users can access through flexible, customised queries. This allows users
to retrieve the information they need in an optimal format, for examples,
relevant articles sorted by date.

Clone the repository from here:

git clone https://github.com/NicholasCanny/beproject-nc-news.git
cd beproject-nc-news

Install dependencies:

NODE
PSQL
npm install

Set Up Environment Variables:

Create a file named .env.development and add the following line:
PGDATABASE=nc_news

Create another file named .env.test and add the following line:
PGDATABASE=nc_news_test

How create and run the databases:

psql -f db/setup.sql
npm run seed

How to run tests:

npm test

Minimum version of software required:

Node v23.3.0
psql (PostgreSQL) 14.15 (Homebrew)
