<!--
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/) --> -->

Clone the repository from here:

git clone https://github.com/NicholasCanny/beproject-nc-news.git

Install dependencies:

NODE
PSQL
npm install
npm install express
npm install --save-dev supertest
npm install --save-dev jest-sorted

Create a file named .env.development and add the following line:
PGDATABASE=nc_news

Create another file named .env.test and add the following line:
PGDATABASE=nc_news_test

To create and run the databases:

psql -f db/setup.sql
npm run seed
