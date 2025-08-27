document.addEventListener('DOMContentLoaded', () => {
    console.log("Página cargada. Iniciando script...");

    // --- Lógica de la Galería Interactiva ---
    console.log("Configurando galería...");
    const galleryData = [
        {
            id: 1,
            type: 'spotify',
            thumbnail: 'musicc.png',
            embedUrl: 'https://open.spotify.com/embed/album/2PFJKjBqXpYrRcdClhfcnX',
            title: 'Mi Playlist de Spotify',
            description: 'La banda sonora de este rincón. Cambia la URL en el código para poner tu propia playlist.'
        },
        {
            id: 2,
            type: 'pinterest',
            thumbnail: 'https://i.imgur.com/bQ4GzFp.png',
            embedUrl: 'https://assets.pinterest.com/ext/embed.html?id=854399020443742915',
            title: 'Mi Tablero de Pinterest',
            description: 'Inspiración visual y estética oscura. Cambia la URL en el código para insertar tu pin favorito.'
        },
        {
            id: 3,
            type: 'image',
            thumbnail: 'https://i.pinimg.com/564x/a4/7c/7c/a47c7c10b1062f4277e9a838b00958f3.jpg',
            imageUrl: 'https://i.pinimg.com/564x/a4/7c/7c/a47c7c10b1062f4277e9a838b00958f3.jpg',
            title: 'Interior de la Catedral',
            description: 'Los vitrales de colores proyectan una luz mística sobre las frías piedras del pasillo principal.'
        }
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

        thumbnailsContainer.querySelectorAll('img').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
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
    const statusForm = document.getElementById('status-form');
    const statusText = document.getElementById('status-text');
    const imageUpload = document.getElementById('image-upload');
    const fontColorInput = document.getElementById('font-color');
    const bgColorInput = document.getElementById('bg-color');
    const postsFeed = document.getElementById('posts-feed');
    const previewImage = document.getElementById('post-preview-image');
    const loginTrigger = document.getElementById('login-trigger');
    const logoutButton = document.getElementById('logout-button');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');

    const ADMIN_CREDENTIALS = {
        username: 'tu_usuario',
        password: 'hola123'
    };
    let isAdmin = sessionStorage.getItem('myGothicAdmin') === 'true';

    function getFromStorage(key, defaultValue) {
        try {
            const item = localStorage.getItem(key);
            console.log(`Leyendo '${key}' de localStorage.`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`Error al leer '${key}' de localStorage. Se usarán valores por defecto.`, e);
            localStorage.removeItem(key);
            return defaultValue;
        }
    }

    let posts = getFromStorage('myGothicPosts', []);
    let userInteractions = getFromStorage('myGothicUserInteractions', {});

    // Migración de datos para asegurar que los posts viejos tengan los nuevos campos
    posts.forEach(post => {
        if (post && typeof post === 'object') {
            post.likes = post.likes || 0;
            post.superlikes = post.superlikes || 0;
            post.dislikes = post.dislikes || 0;
            post.comments = Array.isArray(post.comments) ? post.comments : [];
        }
    });
    console.log("Datos de posts cargados y migrados.");

    const savePosts = () => {
        localStorage.setItem('myGothicPosts', JSON.stringify(posts));
        localStorage.setItem('myGothicUserInteractions', JSON.stringify(userInteractions));
        console.log("Datos guardados en localStorage.");
    };

    const renderPosts = () => {
        console.log("Iniciando renderizado de posts...");
        postsFeed.innerHTML = '';
        if (posts.length === 0) {
            console.log("No hay posts para mostrar.");
        }
        posts.forEach(post => {
            if (!post) return;
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.style.backgroundColor = post.bgColor || 'rgba(0, 0, 0, 0.3)';

            let postHTML = '';
            if (post.imageSrc) {
                postHTML += `<img src="${post.imageSrc}" alt="Imagen del post">`;
            }
            if (post.text) {
                postHTML += `<p style="color: ${post.color};">${post.text}</p>`;
            }

            const userVote = userInteractions[post.id];
            postHTML += `
                <div class="post-interactions">
                    <button class="interaction-btn like-btn ${userVote === 'like' ? 'active' : ''}" data-id="${post.id}" data-type="like">👍 ${post.likes}</button>
                    <button class="interaction-btn superlike-btn ${userVote === 'superlike' ? 'active' : ''}" data-id="${post.id}" data-type="superlike">🖤 ${post.superlikes}</button>
                    <button class="interaction-btn dislike-btn ${userVote === 'dislike' ? 'active' : ''}" data-id="${post.id}" data-type="dislike">👎 ${post.dislikes}</button>
                </div>
                <div class="comments-section">
                    <form class="comment-form" data-id="${post.id}">
                        <input type="text" placeholder="Escribe un comentario anónimo..." required>
                        <button type="submit">Enviar</button>
                    </form>
                    <ul class="comment-list">
                        ${post.comments.map(comment => `<li class="comment-item">${escapeHTML(comment)}</li>`).join('')}
                    </ul>
                </div>
            `;

            let footerHTML = `<div class="post-footer"><span>${post.timestamp}</span>`;
            if (isAdmin) {
                footerHTML += `<button class="delete-btn" data-id="${post.id}">Borrar</button>`;
            }
            footerHTML += `</div>`;
            postHTML += footerHTML;

            postCard.innerHTML = postHTML;
            postsFeed.appendChild(postCard);
        });
        console.log("Renderizado de posts finalizado.");
    };

    const enableAdminMode = () => {
        isAdmin = true;
        sessionStorage.setItem('myGothicAdmin', 'true');
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
        loginTrigger.style.display = 'none';
        renderPosts();
    };

    const disableAdminMode = () => {
        isAdmin = false;
        sessionStorage.removeItem('myGothicAdmin');
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
        loginTrigger.style.display = 'block';
        renderPosts();
    };

    loginTrigger.addEventListener('click', () => loginModal.style.display = 'flex');
    closeModalBtn.addEventListener('click', () => loginModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (usernameInput.value === ADMIN_CREDENTIALS.username && passwordInput.value === ADMIN_CREDENTIALS.password) {
            enableAdminMode();
            loginModal.style.display = 'none';
            loginForm.reset();
        } else {
            alert('Credenciales incorrectas.');
            passwordInput.value = '';
        }
    });

    logoutButton.addEventListener('click', disableAdminMode);

    fontColorInput.addEventListener('input', (e) => statusText.style.color = e.target.value);
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImage.src = event.target.result;
                previewImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    statusForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!statusText.value && previewImage.style.display === 'none') {
            alert('Debes escribir algo o subir una imagen para publicar.');
            return;
        }
        const newPost = {
            id: Date.now(),
            text: statusText.value,
            color: fontColorInput.value,
            bgColor: bgColorInput.value,
            imageSrc: previewImage.style.display === 'block' ? previewImage.src : null,
            timestamp: new Date().toLocaleString('es-ES'),
            likes: 0,
            superlikes: 0,
            dislikes: 0,
            comments: []
        };
        posts.unshift(newPost);
        savePosts();
        renderPosts();
        statusForm.reset();
        statusText.style.color = '#e0e0e0';
        previewImage.style.display = 'none';
    });

    postsFeed.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('delete-btn')) {
            const postId = Number(target.dataset.id);
            posts = posts.filter(post => post.id !== postId);
            delete userInteractions[postId];
            savePosts();
            renderPosts();
        } else if (target.classList.contains('interaction-btn')) {
            const postId = Number(target.dataset.id);
            const voteType = target.dataset.type;
            const post = posts.find(p => p.id === postId);
            if (!post) return;
            const currentVote = userInteractions[postId];
            if (currentVote) {
                post[currentVote + 's']--;
            }
            if (currentVote === voteType) {
                delete userInteractions[postId];
            } else {
                userInteractions[postId] = voteType;
                post[voteType + 's']++;
            }
            savePosts();
            renderPosts();
        }
    });

    postsFeed.addEventListener('submit', (e) => {
        if (e.target.classList.contains('comment-form')) {
            e.preventDefault();
            const postId = Number(e.target.dataset.id);
            const post = posts.find(p => p.id === postId);
            const commentInput = e.target.querySelector('input');
            const commentText = commentInput.value.trim();
            if (commentText && post) {
                post.comments.unshift(commentText);
                savePosts();
                renderPosts();
            }
        }
    });

    function escapeHTML(str) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }

    console.log("Configuración de eventos finalizada.");

    // --- Flujo de Ejecución Principal ---
    if (isAdmin) {
        console.log("Usuario es admin. Habilitando modo admin.");
        enableAdminMode();
    } else {
        console.log("Usuario es visitante.");
    }
    renderPosts();
});

