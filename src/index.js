const express = require('express');
const app = express();
app.use(express.json());

let usuarios = [
  { id: 1, nome: "Vitor Manoel", idade: 20 },
  { id: 2, nome: "Vitor Silva", idade: 45 },
  { id: 3, nome: "Herbert da Silva", idade: 53 }
];

app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

app.post('/usuarios', (req, res) => {
  const novoUsuario = req.body;

  if (!novoUsuario || !novoUsuario.id || !novoUsuario.nome || !novoUsuario.idade) {
    return res.status(400).json({ mensagem: 'Dados inválidos! Envie id, nome e idade.' });
  }

  const idExistente = usuarios.find(u => u.id === novoUsuario.id);
  if (idExistente) {
    return res.status(400).json({ mensagem: 'Erro: ID já cadastrado. Use um ID diferente.' });
  }

  usuarios.push(novoUsuario);
  res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const dadosAtualizados = req.body;

  const index = usuarios.findIndex(u => u.id == id);
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Usuário não encontrado' });
  }

  usuarios[index] = { ...usuarios[index], ...dadosAtualizados };
  res.json({ mensagem: 'Usuário atualizado com sucesso!' });
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <meta charset="UTF-8" />
    <title>API de Usuários</title>
    <body>
      <div id="app"></div>

      <script>
        // Helpers
        const $ = (sel) => document.querySelector(sel);
        const el = (tag, props = {}, children = []) => {
          const node = document.createElement(tag);
          Object.assign(node, props);
          children.forEach(c => node.appendChild(c));
          return node;
        };

        const toast = (msg, ok=true) => {
          const t = el('div', { innerText: msg });
          t.style.position = 'fixed';
          t.style.bottom = '20px';
          t.style.right = '20px';
          t.style.padding = '12px 16px';
          t.style.borderRadius = '10px';
          t.style.boxShadow = '0 8px 24px rgba(0,0,0,.15)';
          t.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial';
          t.style.background = ok ? '#10b981' : '#ef4444';
          t.style.color = '#fff';
          document.body.appendChild(t);
          setTimeout(() => t.remove(), 2400);
        };

        document.body.style.margin = '0';
        document.body.style.minHeight = '100vh';
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
        document.body.style.background = 'linear-gradient(135deg,#0ea5e9 0%, #6366f1 100%)';
        document.body.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial';

        const wrap = el('div');
        wrap.style.width = 'min(720px, 92vw)';
        wrap.style.background = '#ffffff';
        wrap.style.borderRadius = '18px';
        wrap.style.padding = '24px';
        wrap.style.boxShadow = '0 20px 50px rgba(0,0,0,.2)';
        wrap.style.display = 'grid';
        wrap.style.gap = '18px';
        document.body.appendChild(wrap);

        const h1 = el('h1', { innerText: 'API de Usuários' });
        h1.style.margin = '0';
        h1.style.fontSize = '28px';
        h1.style.letterSpacing = '.3px';
        h1.style.color = '#0f172a';
        wrap.appendChild(h1);

        const subtitle = el('p', { innerText: 'Demonstração GET /usuarios, POST /usuarios e PUT /usuarios/:id' });
        subtitle.style.margin = '0 0 4px 0';
        subtitle.style.color = '#334155';
        wrap.appendChild(subtitle);

        const actions = el('div');
        actions.style.display = 'flex';
        actions.style.gap = '10px';
        wrap.appendChild(actions);

        const btnLoad = el('button', { innerText: 'Carregar usuários' });
        const btnIr = el('button', { innerText: 'Visualizar JSON /usuarios" (indica o formato do retorno)' });

        const styleBtn = (b, primary=false) => {
          b.style.padding = '10px 14px';
          b.style.border = '0';
          b.style.borderRadius = '10px';
          b.style.cursor = 'pointer';
          b.style.fontSize = '15px';
          b.style.fontWeight = '600';
          b.style.transition = 'transform .05s ease, filter .2s';
          b.onmousedown = () => b.style.transform = 'scale(.98)';
          b.onmouseup = () => b.style.transform = 'scale(1)';
          if(primary){
            b.style.background = '#0ea5e9';
            b.style.color = '#fff';
          } else {
            b.style.background = '#e2e8f0';
            b.style.color = '#0f172a';
          }
          b.onmouseover = () => b.style.filter = 'brightness(1.05)';
          b.onmouseout  = () => b.style.filter = 'none';
        };
        styleBtn(btnLoad, true);
        styleBtn(btnIr, false);

        actions.appendChild(btnLoad);
        actions.appendChild(btnIr);

        btnIr.onclick = () => window.open('/usuarios', '_blank');

        const cardList = el('div');
        cardList.style.background = '#f8fafc';
        cardList.style.borderRadius = '14px';
        cardList.style.padding = '14px';
        cardList.style.border = '1px solid #e5e7eb';
        wrap.appendChild(cardList);

        const titleList = el('div', { innerText: 'Usuários (GET /usuarios)' });
        titleList.style.fontWeight = '700';
        titleList.style.marginBottom = '10px';
        titleList.style.color = '#0f172a';
        cardList.appendChild(titleList);

        const ul = el('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        ul.style.margin = '0';
        ul.style.display = 'grid';
        ul.style.gap = '8px';
        cardList.appendChild(ul);

        const loading = el('div', { innerText: 'Carregando...' });
        loading.style.display = 'none';
        loading.style.color = '#475569';
        cardList.appendChild(loading);

        const render = (dados) => {
          ul.innerHTML = '';
          if (!dados.length) {
            const li = el('li', { innerText: 'Nenhum usuário cadastrado.' });
            li.style.color = '#475569';
            ul.appendChild(li);
            return;
          }
          dados.forEach(u => {
            const li = el('li');
            li.style.padding = '10px 12px';
            li.style.background = '#fff';
            li.style.border = '1px solid #e5e7eb';
            li.style.borderRadius = '10px';
            li.innerText = \`\${u.id} — \${u.nome} (\${u.idade} anos)\`;
            ul.appendChild(li);
          });
        };

        const carregar = async () => {
          loading.style.display = 'block';
          try {
            const r = await fetch('/usuarios');
            const j = await r.json();
            render(j);
          } catch (e) {
            toast('Falha ao carregar usuários', false);
          } finally {
            loading.style.display = 'none';
          }
        };
        btnLoad.onclick = carregar;

        const cardPost = el('div');
        cardPost.style.background = '#f8fafc';
        cardPost.style.borderRadius = '14px';
        cardPost.style.padding = '14px';
        cardPost.style.border = '1px solid #e5e7eb';
        wrap.appendChild(cardPost);

        const titlePost = el('div', { innerText: 'Cadastrar (POST /usuarios)' });
        titlePost.style.fontWeight = '700';
        titlePost.style.marginBottom = '10px';
        titlePost.style.color = '#0f172a';
        cardPost.appendChild(titlePost);

        const rowPost = el('div'); rowPost.style.display = 'grid'; rowPost.style.gridTemplateColumns = '100px 1fr 140px'; rowPost.style.gap = '8px';
        const inId = el('input', { placeholder: 'id (número)', type:'number' });
        const inNome = el('input', { placeholder: 'nome' });
        const inIdade = el('input', { placeholder: 'idade', type:'number' });
        const btnPost = el('button', { innerText:'Adicionar' });

        [inId,inNome,inIdade].forEach(i=>{
          i.style.padding='10px';
          i.style.border='1px solid #cbd5e1';
          i.style.borderRadius='10px';
          i.style.outline='none';
        });
        styleBtn(btnPost, true);

        const gridPost = el('div'); gridPost.style.display='grid'; gridPost.style.gridTemplateColumns='120px 1fr 120px auto'; gridPost.style.gap='8px';
        const lblId = el('label',{innerText:'ID'}); lblId.style.alignSelf='center';
        const lblNome = el('label',{innerText:'Nome'}); lblNome.style.alignSelf='center';
        const lblIdade = el('label',{innerText:'Idade'}); lblIdade.style.alignSelf='center';
        gridPost.append(lblId,inId,lblNome,inNome,lblIdade,inIdade,btnPost);
        cardPost.appendChild(gridPost);

        btnPost.onclick = async () => {
          const body = { id: Number(inId.value), nome: inNome.value.trim(), idade: Number(inIdade.value) };
          if (!body.id || !body.nome || !body.idade) { toast('Preencha id, nome e idade', false); return; }
          try {
            const r = await fetch('/usuarios', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
            const j = await r.json();
            if (!r.ok) throw new Error(j.mensagem || 'Erro');
            toast(j.mensagem || 'Criado!');
            inId.value = inNome.value = inIdade.value = '';
            carregar();
          } catch(e){ toast(e.message, false); }
        };

        const cardPut = el('div');
        cardPut.style.background = '#f8fafc';
        cardPut.style.borderRadius = '14px';
        cardPut.style.padding = '14px';
        cardPut.style.border = '1px solid #e5e7eb';
        wrap.appendChild(cardPut);

        const titlePut = el('div', { innerText: 'Atualizar (PUT /usuarios/:id)' });
        titlePut.style.fontWeight = '700';
        titlePut.style.marginBottom = '10px';
        titlePut.style.color = '#0f172a';
        cardPut.appendChild(titlePut);

        const inIdPut = el('input', { placeholder: 'id para atualizar', type:'number' });
        const inNomePut = el('input', { placeholder: 'novo nome (opcional)' });
        const inIdadePut = el('input', { placeholder: 'nova idade (opcional)', type:'number' });
        const btnPut = el('button', { innerText:'Atualizar' });

        [inIdPut,inNomePut,inIdadePut].forEach(i=>{
          i.style.padding='10px';
          i.style.border='1px solid #cbd5e1';
          i.style.borderRadius='10px';
          i.style.outline='none';
        });
        styleBtn(btnPut, false);

        const gridPut = el('div'); gridPut.style.display='grid'; gridPut.style.gridTemplateColumns='160px 1fr 160px auto'; gridPut.style.gap='8px';
        const lblIdPut = el('label',{innerText:'ID (existente)'}); lblIdPut.style.alignSelf='center';
        const lblNomePut = el('label',{innerText:'Novo nome'}); lblNomePut.style.alignSelf='center';
        const lblIdadePut = el('label',{innerText:'Nova idade'}); lblIdadePut.style.alignSelf='center';
        gridPut.append(lblIdPut,inIdPut,lblNomePut,inNomePut,lblIdadePut,inIdadePut,btnPut);
        cardPut.appendChild(gridPut);

        btnPut.onclick = async () => {
          const id = Number(inIdPut.value);
          const body = {};
          if (inNomePut.value.trim()) body.nome = inNomePut.value.trim();
          if (inIdadePut.value) body.idade = Number(inIdadePut.value);
          if (!id || (!body.nome && !body.idade)) { toast('Informe o ID e pelo menos um campo para atualizar', false); return; }

          try {
            const r = await fetch('/usuarios/' + id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
            const j = await r.json();
            if (!r.ok) throw new Error(j.mensagem || 'Erro');
            toast(j.mensagem || 'Atualizado!');
            inIdPut.value = inNomePut.value = inIdadePut.value = '';
            carregar();
          } catch(e){ toast(e.message, false); }
        };

        // Carrega automaticamente na entrada
        carregar();
      </script>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});