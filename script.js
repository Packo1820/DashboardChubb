import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "clave-ultra-secreta", // cámbiala a algo largo y seguro
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true } // evita acceso desde consola JS
}));

// Página de login
app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <h2>Login Seguro</h2>
      <input type="text" name="user" placeholder="Usuario" required />
      <input type="password" name="pass" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
    </form>
  `);
});

// Procesar login
app.post("/login", (req, res) => {
  const { user, pass } = req.body;
  // Aquí puedes cambiar usuario/contraseña o validarlos desde BD
  if (user === "admin" && pass === "1234") {
    req.session.auth = true;
    res.redirect("/index");
  } else {
    res.send("❌ Credenciales incorrectas");
  }
});

// Middleware de protección
function authRequired(req, res, next) {
  if (req.session.auth) return next();
  res.redirect("/login");
}

// Dashboard protegido
app.get("/index", authRequired, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Cerrar sesión
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en http://localhost:" + PORT));
