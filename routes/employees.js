const { Router } = require('express');
const router = Router();

const {
    consultarEmpleados,
    consultarEmpleadoPorId,
    insertarEmpleado,
    modificarEmpleado,
    eliminarEmpleado,
    publicRoute,
    protectedRoute,
    login,
    authMiddleware
} = require('../controllers/employeesControllers');

// Employee CRUD routes
router.post('/employee', insertarEmpleado);
router.put('/employee/:id', modificarEmpleado);
router.delete('/employee/:id', eliminarEmpleado);

// **Proteger la ruta con authMiddleware**
router.get('/employees', authMiddleware, consultarEmpleados); // Ruta protegida
router.get('/employee/:id', authMiddleware, consultarEmpleadoPorId);

// Additional routes
router.get('/public', publicRoute);
router.get('/protected', authMiddleware, protectedRoute);
router.get('/login', login);

module.exports = router;