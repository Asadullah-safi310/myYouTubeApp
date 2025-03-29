DevDependency: we can use it only in the development time, it doesn't work on the production environment.
we install nodemon as devDependency: npm i -D nodemon
we make this settings in package.json file inside the script object: "dev": "nodemon src/index.js"

<!--* we install prettier: npm i -D prettier
we create .prettierrc file for the prettier settings 
we create .prettierignore file to tell the prettier to ignore or do not apply your settings to these files -->

then we have created the account and database in mongo db atlas database


we have to import the dotenv and configure it if we imported insted of require for accessing the dotenv variables in index.js file.