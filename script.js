// FUNÇÃO PARA CARREGAR COMENTÁRIOS
function loadComments(articleId) {
    const commentsRef = db.ref('comentarios/' + articleId);
    commentsRef.on('value', (snapshot) => {
        const div = document.getElementById('comments-' + articleId);
        div.innerHTML = '';
        const data = snapshot.val();
        
        if (data) {
            Object.keys(data).forEach(key => {
                const c = data[key];
                div.innerHTML += `
                    <div class="comment-card">
                        <span class="comment-user">${c.nome}:</span>
                        <p class="comment-text">${c.texto}</p>
                        ${(localStorage.getItem('weazel_user') === 'andrewgalloway') ? 
                          `<button onclick="deleteComment('${articleId}', '${key}')" style="background:none; border:none; color:red; cursor:pointer; font-size:0.7rem;">[APAGAR]</button>` : ''}
                    </div>
                `;
            });
        }
    });
}

// FUNÇÃO PARA ENVIAR COMENTÁRIO
async function postComment(articleId) {
    const nome = document.getElementById('name-' + articleId).value || "Anônimo";
    const texto = document.getElementById('input-' + articleId).value;

    if (!texto) return alert("Escreve alguma coisa, cusão!");

    await db.ref('comentarios/' + articleId).push({
        nome: nome,
        texto: texto,
        timestamp: Date.now()
    });

    document.getElementById('input-' + articleId).value = '';
}

// SÓ O ANDREW GALLOWAY APAGA COMENTÁRIO
function deleteComment(articleId, commentId) {
    if(confirm("Deseja apagar esse comentário?")) {
        db.ref('comentarios/' + articleId + '/' + commentId).remove();
    }
}
