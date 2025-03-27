DevDependency: we can use it only in the development time, it doesn't work on the production environment.
we install nodemon as devDependency: npm i -D nodemon
we make this settings in package.json file inside the script object: "dev": "nodemon src/index.js"

<!--* we install prettier: npm i -D prettier
we create .prettierrc for the prettier settings 
we create .prettierignore to tell the prettier to ignore or do not apply your settings to these files -->