import http from "http";
import {
  adicionarDocumento,
  listarDocumentos,
  buscarDocumentosPorId,
  atualizarDocumentos,
  deletarDocumentos,
} from "./API.js";

import { verificarAutenticacao, verificarAdmin } from "./admin.js";

const port = process.env.PORT || 3000;


const server = http.createServer(async (req, res) => {
  // Habilita CORS 
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Responde pré-requests de CORS
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url;
  const method = req.method;






  // GET /produtos → Lista todos
  if (url === "/produtos" && method === "GET") {
    const produtos = await listarDocumentos("produtos");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(produtos));
    return;
  }

  // GET /produtos/:id → Busca por ID
  if (url.startsWith("/produtos/") && method === "GET") {
    const cleanUrl = url.split("?")[0];
    const id = cleanUrl.split("/")[2];

    if (!id || id.trim() === "") {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "ID inválido" }));
      return;
    }

    try {
      const produto = await buscarDocumentosPorId("produtos",id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(produto));
    } catch (error) {
      console.error("Erro ao buscar produto:", error.message);
      if (error.message === "Produto não encontrado!") {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Produto não encontrado" }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erro interno ao buscar produto", detalhe: error.message }));
      }
    }
    return;
  }

  // POST /produtos → Cadastrar
  if (url === "/produtos" && method === "POST") {

    try {
    await verificarAutenticacao(req);
    // segue o código da rota normalmente
    } catch (error) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        const id = await adicionarDocumento("produtos",dados);
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
        await atualizarDocumentos("produtos", id, dados);
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

    try {
    await verificarAdmin(req);
    } catch (error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    const id = url.split("/")[2];
    try {
      await deletarDocumentos("produtos",id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ mensagem: "Produto deletado" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Erro ao deletar produto" }));
    }
    return;
  }







  
  // GET /usuarios → Lista todos
  if (url === "/usuarios" && method === "GET") {
    const usuarios = await listarDocumentos("usuarios");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(usuarios));
    return;
  }

  // GET /usuarios/:id → Busca por ID
  if (url.startsWith("/usuarios/") && method === "GET") {
    const cleanUrl = url.split("?")[0];
    const id = cleanUrl.split("/")[2];

    if (!id || id.trim() === "") {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "ID inválido" }));
      return;
    }

    try {
      const usuario = await buscarDocumentosPorId("usuarios",id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(usuario));
    } catch (error) {
      console.error("Erro ao buscar usuário:", error.message);
      if (error.message === "Usuário não encontrado!") {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Usuário não encontrado" }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Erro interno ao buscar usuário", detalhe: error.message }));
      }
    }
    return;
  }

  // POST /usuarios → Cadastrar
  if (url === "/usuarios" && method === "POST") {

    try {
    await verificarAutenticacao(req);
    // segue o código da rota normalmente
    } catch (error) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        const id = await adicionarDocumento("usuarios",dados);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Usuário criado", id }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Erro ao criar usuário" }));
      }
    });
    return;
  }

  // PUT /usuarios/:id → Atualizar
  if (url.startsWith("/usuarios/") && method === "PUT") {
    const id = url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        await atualizarDocumentos("usuarios", id, dados);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Usuário atualizado" }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Erro ao atualizar usuário" }));
      }
    });
    return;
  }

  // DELETE /usuarios/:id → Deletar
  if (url.startsWith("/usuarios/") && method === "DELETE") {

    try {
    await verificarAdmin(req);
    } catch (error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    const id = url.split("/")[2];
    try {
      await deletarDocumentos("usuarios",id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ mensagem: "Usuário deletado" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Erro ao deletar usuário" }));
    }
    return;
  }
  





    // GET /kits → Lista todos
  if (url === "/kits" && method === "GET") {
    const kits = await listarDocumentos("kits");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(kits));
    return;
  }

  // GET /kits/:id → Busca por ID
  if (url.startsWith("/kits/") && method === "GET") {
    const cleanUrl = url.split("?")[0];
    const id = cleanUrl.split("/")[2];

    if (!id || id.trim() === "") {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "ID inválido" }));
      return;
    }

    try {
      const kit = await buscarDocumentosPorId("kits", id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(kit));
    } catch (error) {
      console.error("Erro ao buscar kit:", error.message);
      if (error.message === "Kit não encontrado!") {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Kit não encontrado" }));
      } else {
        res.writeHead(500);
        res.end(
          JSON.stringify({
            error: "Erro interno ao buscar kit",
            detalhe: error.message,
          })
        );
      }
    }
    return;
  }

  // POST /kits → Cadastrar
  if (url === "/kits" && method === "POST") {
    try {
      await verificarAutenticacao(req);
    } catch (error) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        const id = await adicionarDocumento("kits", dados);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Kit criado", id }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Erro ao criar kit" }));
      }
    });
    return;
  }

  // PUT /kits/:id → Atualizar
  if (url.startsWith("/kits/") && method === "PUT") {
    const id = url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const dados = JSON.parse(body);
        await atualizarDocumentos("kits", id, dados);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ mensagem: "Kit atualizado" }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Erro ao atualizar kit" }));
      }
    });
    return;
  }

  // DELETE /kits/:id → Deletar
  if (url.startsWith("/kits/") && method === "DELETE") {
    try {
      await verificarAdmin(req);
    } catch (error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: error.message }));
      return;
    }

    const id = url.split("/")[2];
    try {
      await deletarDocumentos("kits", id);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ mensagem: "Kit deletado" }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Erro ao deletar kit" }));
    }
    return;
  }








  if(url === "/" && method === "GET"){
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ mensagem: "API Chá & Encantos funcionando 🍵✨" }));
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
