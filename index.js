const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({ path: 'pass.env' }); // Load environment variables

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the routes from employees.js
app.use(require('./routes/employees'));

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});