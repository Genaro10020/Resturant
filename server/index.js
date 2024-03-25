const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { sha256 } = require('js-sha256');

const app = express();

// Configuración básica de CORS
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pedidos',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos establecida correctamente');
    }
});


app.listen(3001, () => {
    console.log('Escucho 3001 !!');
});




// Ruta GET para obtener todos los productos
app.get("/products", (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error interno del servidor al consultar");
        } else {
            res.send(result);
        }
    });
});


app.post("/createProducts", (req, res) => {
    const { nombre, descripcion, cantidad, precio } = req.body;

    db.query("INSERT INTO productos(nombre, descripcion, cantidad, precio) VALUES (?, ?, ?, ?)", [nombre, descripcion, cantidad, precio], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error interno del servidor al crear");
        } else {
            //res.setHeader('Access-Control-Allow-Origin', '*');
            res.send("Registrado con éxito!!");
        }
    });
});

app.post('/verifyUser', (req, res) => {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
        return res.status(400).send('Usuario y Password Requeridos');
    }

    //const hashedPassword = sha256(password); // Hashear la contraseña recibida del cliente

    db.query('SELECT * FROM users WHERE user=? AND password=?', [usuario, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor al consultar");
        }

        if (result.length === 0) {
            return res.status(401).send('Usuario o contraseña incorrectos');
        }

        res.send(true);
    });
});

app.put("/updateProduct", (req, res) => {
    const { nombre, descripcion, cantidad, precio, id } = req.body;

    db.query("UPDATE productos SET nombre=?, descripcion=?, cantidad=?, precio=? WHERE id=?", [nombre, descripcion, cantidad, precio, id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error interno del servidor al actulizar");
        } else {
            //res.setHeader('Access-Control-Allow-Origin', '*');
            res.send("Actualizado con éxito!!");
        }
    });
});

app.delete("/deleteProduct/", (req, res) => {
    const id = req.body.id;

    db.query("DELETE FROM productos WHERE id=?", id, (error, result) => {
        if (!error) {
            res.send("Elimido" + result);
        } else {
            console.log("Error al eliminar" + error);
        }
    })

});


