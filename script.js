document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('#searchForm');
    const pagination = document.querySelector('#pagination');
    const pageTitle = document.querySelector('#pageTitle'); // Selección del título
    let currentPage = 1;
    let totalResults = [];
    const totalPages = 4; // Asumiendo que hay 4 páginas, ajusta según sea necesario

    // Función para cargar películas populares
    async function loadPopularMovies(page) {
        const results = await fetchDataByPopularity(page);
        totalResults = results.results;
        displayResults({ results: totalResults });
    }

    // Evento al hacer clic en el título para volver al inicio
    pageTitle.addEventListener('click', async () => {
        currentPage = 1; // Volver a la primera página
        await loadPopularMovies(currentPage); // Cargar películas populares de la página 1
    });

    // Eventos de mouseenter y mouseleave para agrandar el título
    pageTitle.addEventListener('mouseenter', () => {
        pageTitle.style.transition = 'transform 0.2s ease'; // Transición suave
        pageTitle.style.transform = 'scale(1.05)'; // Agrandar levemente al pasar el mouse
    });

    pageTitle.addEventListener('mouseleave', () => {
        pageTitle.style.transition = 'transform 0.2s ease'; // Transición suave
        pageTitle.style.transform = 'scale(1)'; // Restaurar tamaño original al salir del área
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const btn = document.querySelector('#btn');
        btn.setAttribute('aria-busy', true);

        const resultado = await fetchDataByTitle();
        displayResults(resultado);

        btn.setAttribute('aria-busy', false);
    });

    pagination.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON') {
            const page = event.target.value;
            if (page === 'first') {
                currentPage = 1;
            } else if (page === 'last') {
                currentPage = totalPages;
            } else {
                currentPage = parseInt(page);
            }
            await loadPopularMovies(currentPage); // Cargar películas populares de la página seleccionada
        }
    });

    async function fetchDataByTitle() {
        const title = document.querySelector('#title').value.trim();
        const language = document.querySelector('#titleLanguage').value;
        const api_key = 'd584128db693e2f7bd85856d131e1eb9';
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${title}&language=${language}&page=1`;

        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    async function fetchDataByPopularity(page) {
        const language = document.querySelector('#titleLanguage').value;
        const api_key = 'd584128db693e2f7bd85856d131e1eb9';
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=${language}&page=${page}`;

        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    function displayResults(resultado) {
        const output = document.querySelector('#output');
        output.innerHTML = '';

        if (resultado && resultado.results.length > 0) {
            resultado.results.forEach(movie => {
                const title = movie.original_title;
                const description = movie.overview;
                const poster = movie.poster_path;
                output.innerHTML += `
                    <article class="movie-article">
                        <img src="https://image.tmdb.org/t/p/w500/${poster}" alt="${title}" class="movie-poster">
                        <div class="movie-details">
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </div>
                    </article>`;
            });
        } else {
            output.innerHTML = '<p>No se encontraron resultados.</p>';
        }
    }

    // Función para generar los botones de paginación
    function generatePaginationButtons(totalPages) {
        const paginationContainer = document.querySelector('#pagination');
        paginationContainer.innerHTML = ''; // Limpiar contenedor existente

        const firstButton = createPaginationButton('first', '<<');
        paginationContainer.appendChild(firstButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPaginationButton(i.toString(), i.toString());
            paginationContainer.appendChild(pageButton);
        }

        const lastButton = createPaginationButton('last', '>>');
        paginationContainer.appendChild(lastButton);
    }

    // Función para crear botones de paginación individuales
    function createPaginationButton(value, text) {
        const button = document.createElement('button');
        button.textContent = text;
        button.value = value;
        return button;
    }

    // Cargar películas populares al iniciar y generar botones de paginación
    await loadPopularMovies(currentPage);
    generatePaginationButtons(totalPages);
});