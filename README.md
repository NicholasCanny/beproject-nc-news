<!--
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/) --> -->

Clone the repository from here:

git clone https://github.com/NicholasCanny/beproject-nc-news.git

Install dependencies:

NODE
PSQL
npm install

Create a file named .env.development and add the following line:
PGDATABASE=nc_news

Create another file named .env.test and add the following line:
PGDATABASE=nc_news_test

To create and run the databases:

psql -f db/setup.sql
npm run seed

Linked to website:
https://nicholascannybackendproject.onrender.com/api/

Summary of project:

This project involved building an API that enables programmatic access to data.
It was designed to simulate a real-world backend service, such as Reddit, to
provide information to a frontend environment.

The database consisted of multiple tables containing a variety of information,
which users can access through flexible, customised queries. This allows users
to retrieve the information they need in an optimal format, for examples,
relevant articles sorted by date.
