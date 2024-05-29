document.getElementById('boton').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe y recargue la página
    
    var movieName = document.getElementById('search-input').value;
    var apiKey = 'd584128db693e2f7bd85856d131e1eb9'; // Reemplaza esto con tu clave de API de OMDB
    var accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNTg0MTI4ZGI2OTNlMmY3YmQ4NTg1NmQxMzFlMWViOSIsInN1YiI6IjY2NDdjZWZlZTZjYWY5Y2RlODExZTI4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.52DO29M1MFV_pUtAb6aFSMhkkHLr4BPesJh9Gx-g6a0';

    if (movieName) {
        // Hacer la solicitud a la API de OMDB usando el parámetro 's' para búsquedas parciales
        var requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };

        fetch(`https://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Añadir esto para inspeccionar la respuesta de la API
                var movieData = document.getElementById('movie-data');
                movieData.innerHTML = ''; // Limpiar resultados anteriores

                if (data.Response === "True") {
                    data.Search.forEach(movie => {
                        movieData.innerHTML += `
                            <div class="card mt-4">
                                <div class="card-body">
                                    <h5 class="card-title">${movie.Title}</h5>
                                    <p class="card-text"><strong>Año:</strong> ${movie.Year}</p>
                                    <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title}">
                                </div>
                            </div>
                        `;
                    });
                } else {
                    movieData.innerHTML = `<div class="alert alert-danger" role="alert">Película no encontrada.</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                var movieData = document.getElementById('movie-data');
                movieData.innerHTML = `<div class="alert alert-danger" role="alert">Ocurrió un error al buscar la película.</div>`;
            });
    }
});



