document.addEventListener('DOMContentLoaded', () => {
    console.log("Página cargada. Iniciando script...");

    // --- Lógica de la Galería Interactiva (Sin cambios) ---
    const galleryData = [
        { id: 1, type: 'spotify', thumbnail: 'musicc.png', embedUrl: 'https://open.spotify.com/embed/album/2PFJKjBqXpYrRcdClhfcnX', title: 'Mi Playlist de Spotify', description: 'La banda sonora de este rincón.' },
        { id: 2, type: 'pinterest', thumbnail: 'https://i.imgur.com/bQ4GzFp.png', embedUrl: 'https://assets.pinterest.com/ext/embed.html?id=854399020443742915', title: 'Mi Tablero de Pinterest', description: 'Inspiración visual y estética oscura.' },
        { id: 3, type: 'image', thumbnail: 'https://i.pinimg.com/564x/a4/7c/7c/a47c7c10b1062f4277e9a838b00958f3.jpg', imageUrl: 'https://i.pinimg.com/564x/a4/7c/7c/a47c7c10b1062f4277e9a838b00958f3.jpg', title: 'Interior de la Catedral', description: 'Luz mística sobre las frías piedras.' }
    ];
    const mainDisplay = document.querySelector('.main-image-display');
    const imageTitle = document.getElementById('image-title');
    const imageDescription = document.getElementById('image-description');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    function updateDisplay(index) {
        if (!galleryData[index]) return;
        const item = galleryData[index];
        mainDisplay.style.opacity = 0;
        setTimeout(() => {
            mainDisplay.innerHTML = '';
            if (item.type === 'spotify' || item.type === 'pinterest') {
                const iframe = document.createElement('iframe');
                iframe.src = item.embedUrl;
                iframe.setAttribute('allow', 'encrypted-media');
                mainDisplay.appendChild(iframe);
            } else {
                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.alt = item.title;
                mainDisplay.appendChild(img);
            }
            imageTitle.textContent = item.title;
            imageDescription.textContent = item.description;
            mainDisplay.style.opacity = 1;
        }, 300);
        thumbnailsContainer.querySelectorAll('img').forEach((thumb, i) => thumb.classList.toggle('active', i === index));
    }

    if (galleryData.length > 0) {
        galleryData.forEach((item, index) => {
            const thumb = document.createElement('img');
            thumb.src = item.thumbnail;
            thumb.alt = `Miniatura de ${item.title}`;
            thumb.addEventListener('click', () => updateDisplay(index));
            thumbnailsContainer.appendChild(thumb);
        });
        updateDisplay(0);
    }
    scrollLeftBtn.addEventListener('click', () => thumbnailsContainer.scrollBy({ left: -150, behavior: 'smooth' }));
    scrollRightBtn.addEventListener('click', () => thumbnailsContainer.scrollBy({ left: 150, behavior: 'smooth' }));
    console.log("Galería configurada correctamente.");

    // --- Lógica para el Blog de Estados ---
    console.log("Configurando blog...");
    const postsFeed = document.getElementById('posts-feed');

    // =======================================================================
    // AQUÍ ES DONDE AÑADIRÁS TUS POSTS. ¡ESTA ES TU "BASE DE DATOS"!
    // Copia y pega un bloque de {} para crear un nuevo post.
    // El 'id' debe ser único para cada post.
    // =======================================================================
    const posts = [
        {
            id: 1678886400000, // Usa un número único, como la fecha en milisegundos
            text: "Este es mi primer estado en la página. ¡Espero que les guste! \nAhora los posts están guardados directamente en el código, así que todos podrán verlos.",
            color: "#e0e0e0",
            bgColor: "rgba(50, 0, 25, 0.5)",
            imageSrc: null, // Pon una URL de imagen aquí o déjalo como null
            timestamp: "15/03/2023, 12:00:00"
        },
        {
            id: 1678890000000,
            text: "Se pueden añadir imágenes también.",
            color: "#f0c0e0",
            bgColor: "#310031",
            imageSrc: "https://i.pinimg.com/564x/53/7a/a7/537aa7975f10f137e163b655a14595e1.jpg",
            timestamp: "15/03/2023, 13:00:00"
        }
        // <<< Pega tu nuevo post aquí
    ];

    // Las interacciones de los usuarios (likes, comentarios) SÍ se guardan en su localStorage.
    let interactions = getFromStorage('myGothicInteractions', {});
    let userVotes = getFromStorage('myGothicUserVotes', {});

    function getFromStorage(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`Error al leer '${key}' de localStorage.`, e);
            return defaultValue;
        }
    }

    function saveInteractions() {
        localStorage.setItem('myGothicInteractions', JSON.stringify(interactions));
        localStorage.setItem('myGothicUserVotes', JSON.stringify(userVotes));
    }

    function renderPosts() {
        console.log("Iniciando renderizado de posts...");
        postsFeed.innerHTML = '';
        posts.forEach(post => {
            if (!post) return;

            // Obtenemos las interacciones para este post, o creamos un objeto vacío si no existen
            const postInteractions = interactions[post.id] || { likes: 0, superlikes: 0, dislikes: 0, comments: [] };
            const userVote = userVotes[post.id];

            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.style.backgroundColor = post.bgColor || 'rgba(0, 0, 0, 0.3)';

            let postHTML = '';
            if (post.imageSrc) postHTML += `<img src="${post.imageSrc}" alt="Imagen del post">`;
            if (post.text) postHTML += `<p style="color: ${post.color};">${post.text.replace(/\n/g, '<br>')}</p>`;

            postHTML += `
                <div class="post-interactions">
                    <button class="interaction-btn like-btn ${userVote === 'like' ? 'active' : ''}" data-id="${post.id}" data-type="like">👍 ${postInteractions.likes}</button>
                    <button class="interaction-btn superlike-btn ${userVote === 'superlike' ? 'active' : ''}" data-id="${post.id}" data-type="superlike">🖤 ${postInteractions.superlikes}</button>
                    <button class="interaction-btn dislike-btn ${userVote === 'dislike' ? 'active' : ''}" data-id="${post.id}" data-type="dislike">👎 ${postInteractions.dislikes}</button>
                </div>
                <div class="comments-section">
                    <form class="comment-form" data-id="${post.id}">
                        <input type="text" placeholder="Escribe un comentario anónimo..." required>
                        <button type="submit">Enviar</button>
                    </form>
                    <ul class="comment-list">
                        ${postInteractions.comments.map(comment => `<li class="comment-item">${escapeHTML(comment)}</li>`).join('')}
                    </ul>
                </div>
                <div class="post-footer"><span>${post.timestamp}</span></div>
            `;

            postCard.innerHTML = postHTML;
            postsFeed.appendChild(postCard);
        });
        console.log("Renderizado de posts finalizado.");
    }

    postsFeed.addEventListener('click', (e) => {
        if (e.target.classList.contains('interaction-btn')) {
            const postId = Number(e.target.dataset.id);
            const voteType = e.target.dataset.type;
            
            // Asegurarse de que el objeto de interacciones para este post exista
            if (!interactions[postId]) {
                interactions[postId] = { likes: 0, superlikes: 0, dislikes: 0, comments: [] };
            }
            const postInteractions = interactions[postId];
            const currentVote = userVotes[postId];

            // Si el usuario ya había votado, revertir el conteo anterior
            if (currentVote) {
                postInteractions[currentVote]--;
            }

            // Si el usuario hace clic en el mismo botón, es para quitar el voto
            if (currentVote === voteType) {
                delete userVotes[postId];
            } else { // Si es un voto nuevo o diferente
                userVotes[postId] = voteType;
                postInteractions[voteType]++;
            }
            
            saveInteractions();
            renderPosts();
        }
    });

    postsFeed.addEventListener('submit', (e) => {
        if (e.target.classList.contains('comment-form')) {
            e.preventDefault();
            const postId = Number(e.target.dataset.id);
            if (!interactions[postId]) {
                interactions[postId] = { likes: 0, superlikes: 0, dislikes: 0, comments: [] };
            }
            const commentInput = e.target.querySelector('input');
            const commentText = commentInput.value.trim();

            if (commentText) {
                interactions[postId].comments.unshift(commentText);
                saveInteractions();
                renderPosts();
            }
        }
    });

    function escapeHTML(str) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    // --- Flujo de Ejecución Principal ---
    renderPosts();
});

