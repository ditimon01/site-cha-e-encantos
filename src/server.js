import http from "http";
import {
  adicionarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  deletarProduto,
} from "./API.js";

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Habilita CORS //nao sabemos ainda oq é.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responde pré-requests de CORS //nao sabemos ainda oq é.
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;
  const method = req.method;

  // GET /produtos → Lista todos
  if (url === "/produtos" && method === "GET") {
    const produtos = await listarProdutos();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(produtos));
    return;
  }

  // GET /produtos/:id → Busca por ID
  if (url.startsWith("/produtos/") && method === "GET") {
    const id = url.split("/")[2];
    try {
      const produto = await buscarProdutoPorId(id);
      if (!produto) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Produto não encontrado" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(produto));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Erro ao buscar produto" }));
    }
    return;
  }

  // POST /produtos → Cadastrar
  if (url === "/produtos" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        const id = await adicionarProduto(dados);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Produto criado", id }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Erro ao criar produto" }));
      }
    });
    return;
  }

  // PUT /produtos/:id → Atualizar
  if (url.startsWith("/produtos/") && method === "PUT") {
    const id = url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        await atualizarProduto(id, dados);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Produto atualizado" }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Erro ao atualizar produto" }));
      }
    });
    return;
  }

  // DELETE /produtos/:id → Deletar
  if (url.startsWith("/produtos/") && method === "DELETE") {
    const id = url.split("/")[2];
    try {
      await deletarProduto(id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ mensagem: "Produto deletado" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Erro ao deletar produto" }));
    }
    return;
  }

  // Rota não encontrada
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

// Inicia o servidor
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
