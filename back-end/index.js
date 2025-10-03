import 'dotenv/config'; // ✅ CARREGAR VARIÁVEIS DE AMBIENTE (.ENV)
import express from "express";
const app = express();
import Hortalica from "./models/Hortalica.js";
import User from "./models/User.js";
import userRoutes from "./routes/userRoutes.js";
import hortalicaRoutes from "./routes/hortalicaRoutes.js";
import path from "path"; 
import { fileURLToPath } from 'url';

//Importando mongoose
import mongoose from "mongoose";

//Conexão com MongoDB
mongoose
.connect("mongodb://127.0.0.1:27017/greenrise")
.then(() => console.log("✅ Conectado ao MongoDB Server com sucesso!"))
.catch((err) => console.log("❌ Erro ao conectar no MongoDB:", err));

//Configurações do Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/", userRoutes)
app.use("/", hortalicaRoutes)

// ✅ Caminho absoluto para static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, '..', 'front-end', 'uploads');

app.use("/uploads", express.static(staticPath));
console.log("🔍 Servindo arquivos estáticos de:", staticPath);

//Criando retorno da API para tudo junto (rota direta pelo index)
app.get("/", async (req, res) => {
try {
const users = await User.find();
const hortalicas = await Hortalica.find();
res.status(200).json({ message: "✅ Rota Index Funcionando", users, hortalicas });
} catch (error) {
console.log(error);
res.status(500).json({ error: "❌ Erro interno do servidor requisição tudo junto" });
 }
});

// ✅ Middleware para rotas não encontradas
app.use((req, res) => {
    console.log(`❌ Rota não encontrada: ${req.method} ${req.originalUrl}`);
    
    res.status(404).json({
        success: false,
        error: "Rota não encontrada",
        message: `A rota ${req.method} ${req.originalUrl} não existe`,
        timestamp: new Date().toISOString(),
    });
});

//Rodando API na porta 4000
const port = 4000;
app.listen(port, (error) => {
if (error) {
    console.log(`❌ Erro na porta 4000`, error);
}
console.log(`✅ API Greenrise Back-end rodando em http://localhost:${port}`);
});