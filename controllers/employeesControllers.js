const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../conexion'); // Import the database connection

dotenv.config({ path: 'pass.env' }); // Load environment variables

// Middleware for authentication
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Public route (no authentication required)
const publicRoute = (req, res) => {
    res.json({ message: 'This is a public route' });
};

// Protected route (requires authentication)
const protectedRoute = (req, res) => {
    res.json({ message: 'Access allowed to protected route', user: req.user });
};

// Login route to generate JWT
const login = (req, res) => {
    const user = { id: 1, username: 'usuario_prueba' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
};

// CRUD operations

// Insert an employee
async function insertarEmpleado(req, res) {
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    const query = `INSERT INTO employees (
        first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    const values = [first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id];

    try {
        const client = await pool.connect();
        await client.query(query, values);
        client.release();
        res.status(201).json({ message: 'Employee successfully created' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Update an employee
async function modificarEmpleado(req, res) {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    const query = `UPDATE employees
    SET first_name = $2, last_name = $3, email = $4, phone_number = $5, hire_date = $6, job_id = $7,
    salary = $8, commission_pct = $9, manager_id = $10, department_id = $11
    WHERE employee_id = $1`;

    const values = [id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Employee successfully updated' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete an employee
async function eliminarEmpleado(req, res) {
    const { id } = req.params;

    const query = 'DELETE FROM employees WHERE employee_id = $1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Employee successfully deleted' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get all employees
async function consultarEmpleados(req, res) {
    const query = 'SELECT employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id FROM employees';

    try {
        const client = await pool.connect();
        const result = await client.query(query);
        client.release();

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

// Get an employee by ID
async function consultarEmpleadoPorId(req, res) {
    const { id } = req.params;

    const query = 'SELECT * FROM employees WHERE employee_id = $1';
    const values = [id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = {
    insertarEmpleado,
    modificarEmpleado,
    eliminarEmpleado,
    consultarEmpleados,
    consultarEmpleadoPorId,
    publicRoute,
    protectedRoute,
    login,
    authMiddleware
};