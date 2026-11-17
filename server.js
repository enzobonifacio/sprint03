import express from "express";

const app = express();
const PORT = 3000;


const mensagens = [
    { id: 1, usuario: "Ana", texto: "Bom dia!" },
    { id: 2, usuario: "Pedro", texto: "Olá, turma!" },
    { id: 3, usuario: "Maria", texto: "Nosso servidor está funcionando!" },
];


function listarMensagens() { return mensagens; }


function buscarMensagem(id) { return mensagens.find(m => m.id === id); }

function consultarMensagens(simularErro = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (simularErro) return reject(new Error("Falha simulada na consulta."));
            resolve(listarMensagens());
        }, 1000);
    });
}




app.get("/", (req, res) => res.send("Servidor rodando! 🚀"));

app.get("/status", (req, res) =>
    res.json({ status: "online", sprint: 3 })
);

app.get("/sobre", (req, res) =>
    res.send("Mensageiro Local com Node.js, Express e ES Modules.")
);


app.get("/mensagens", (req, res) =>
    res.json(listarMensagens())
);

app.get("/mensagens/:id", (req, res) => {
    const id = Number(req.params.id);
    const mensagem = buscarMensagem(id);

    if (!mensagem) {
        return res.status(404).json({
            erro: "Mensagem não encontrada."
        });
    }

    res.json(mensagem);
});

app.get("/total-mensagens", (req, res) =>
    res.json({ total: mensagens.length })
);


app.get("/mensagens-then", (req, res) => {
    consultarMensagens()
        .then(dados => res.json(dados))
        .catch(erro => {
            console.error(erro);
            res.status(500).json({
                erro: "Falha ao consultar mensagens."
            });
        });
});

app.get("/mensagens-async", async (req, res) => {
    try {
        res.json(await consultarMensagens());
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Falha ao consultar mensagens."
        });
    }
});

app.get("/mensagens-erro", async (req, res) => {
    try {
        res.json(await consultarMensagens(true));
    } catch (erro) {
        console.error("Erro simulado:", erro.message);
        res.status(500).json({
            erro: "Falha simulada na consulta."
        });
    }
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});