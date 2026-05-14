// Variável global para saber o que estamos vendo
let currentView = 'all'; 

function render(data, filter = 'all', singleId = null) {
    const feed = document.getElementById('feed-page');
    feed.innerHTML = '';
    
    if(!data) {
        feed.innerHTML = `<p style="text-align:center; color:#444; margin-top:80px">Nenhuma notícia disponível ainda.</p>`;
        return;
    }

    const articles = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
    })).sort((a, b) => b.timestamp - a.timestamp);

    // MODO MATÉRIA COMPLETA
    if (singleId) {
        const item = articles.find(a => a.id === singleId);
        if (item) {
            const paragraphs = item.content.split('\n');
            let contentHtml = '';
            let imgCount = 0;

            paragraphs.forEach(p => {
                if(p.trim()) {
                    contentHtml += `<p>${p}</p>`;
                    if(item.images && item.images[imgCount]) {
                        contentHtml += `<img src="${item.images[imgCount]}" class="news-img">`;
                        imgCount++;
                    }
                }
            });

            feed.innerHTML = `
                <button class="btn-home-back" onclick="window.location.reload()">⬅ VOLTAR PARA O INÍCIO</button>
                <div class="news-card" style="cursor:default; transform:none !important;">
                    <div class="card-header"><span class="badge">${item.category}</span></div>
                    <div class="card-content">
                        <h1 class="news-title" style="font-size:3.5rem;">${item.title}</h1>
                        <span class="news-meta">Publicado por: <strong>${item.author}</strong> - ${item.date}</span>
                        <div class="content-body">${contentHtml}</div>
                        ${isLogged ? `<button onclick="deletePost('${item.id}')">Apagar</button>` : ''}
                    </div>
                </div>`;
            window.scrollTo(0,0);
            return;
        }
    }

    // MODO LISTA (HOME)
    const filteredData = filter === 'all' ? articles : articles.filter(n => n.category === filter);

    filteredData.forEach(item => {
        // Pega a primeira imagem para ser a "capa" no card
        const thumb = item.images && item.images[0] ? `<img src="${item.images[0]}" class="news-img" style="margin:0; height:200px; object-fit:cover;">` : '';
        
        feed.innerHTML += `
            <div class="news-card" onclick="openNews('${item.id}')">
                ${thumb}
                <div class="card-content" style="padding: 20px;">
                    <span class="badge" style="font-size:0.6rem;">${item.category}</span>
                    <h2 class="news-title" style="font-size:1.8rem; margin-top:10px;">${item.title}</h2>
                    <div class="content-preview">${item.content.substring(0, 150)}...</div>
                    <p style="color:var(--primary); font-weight:bold; margin-top:15px; font-size:0.8rem;">CLIQUE PARA LER A MATÉRIA COMPLETA</p>
                </div>
            </div>
        `;
    });
}

// Função para abrir uma única notícia
function openNews(id) {
    newsRef.once('value', (snapshot) => {
        render(snapshot.val(), 'all', id);
        // Esconde o filtro quando está lendo uma matéria
        document.getElementById('filter-nav').classList.add('hidden');
    });
}

// Ajuste no filtro para garantir que ele resete a visão
function filterNews(cat, btn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('filter-nav').classList.remove('hidden');
    newsRef.once('value', (snapshot) => render(snapshot.val(), cat));
}
