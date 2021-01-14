async function load() {
    /******************** DECLARACIÓN D VARIABLES */
    const $actionContainer = document.getElementById('action')
    const $horrorContainer = document.getElementById('horror')
    const $mysteryContainer = document.getElementById('mystery')
    const $dramaContainer = document.getElementById('drama')

    const $home = document.getElementById('home')    
    const $featuringContainer = document.getElementById('featuring')
    const $form = document.getElementById('form')
    const $overlay = document.getElementById('overlay')

    const $modal = document.getElementById('modal')
    const $modalTitle = $modal.querySelector('h1')
    const $modalImage = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')
    const $hideModal = document.getElementById('hide-modal')


    /////////* BASE_API DE DATOS DE PELÍCULAS *//////////////
    const BASE_API = 'https://yts.lt/api/v2/'  
    /////////////////////////////////////////////////////////
    
    
    /******************** FUNCIÓN: TRAER INFORMACIÓN */
    async function getData(url) {
        const response = await fetch(url)
        const data = await response.json()
        // debugger
        if(data.data.movie_count > 0) {
            return data
        }

        throw new Error('Error: No se ha encontrado ningún resultado.')
    }
    
    /******************** FUNCIÓN: CREAR PLANTILLA HTML */
    function createHTMLTemplate(HTMLString) {
        const html = document.implementation.createHTMLDocument()
        html.body.innerHTML = HTMLString    /** se cambia el innerHTML del body del html creado con el contenido de la película que llega en HTMLString */
        return html.body.children[0]        /** para que luego se realice un append del return y se muestren todas las películas */
    }
    
    /******************** FUNCIÓN: DEFINIR ATRIBUTOS A ELEMENTOS */
    function setAttributes($element, attributes) {
        for ( const i in attributes) {
            $element.setAttribute(i, attributes[i])
        }
    }
    
    /******************** OBTENER LISTAS DE PELÍCULAS */
    const LIST_GENRE = `list_movies.json?genre=`
    // const { data: { movies: actionList } }  = await getData(`${BASE_API}${LIST_GENRE}action`)  /** Objeto desestructurado  */
    // const { data: { movies: horrorList } } = await getData(`${BASE_API}${LIST_GENRE}horror`)
    // const { data: { movies: mysteryList } } = await getData(`${BASE_API}${LIST_GENRE}mystery`)
    // const { data: { movies: dramaList } } = await getData(`${BASE_API}${LIST_GENRE}drama`)
    // console.log('actionList' + actionList) // prueba de datos
    

    /******************** ANIMACIÓN DE MODAL */
    function addEventClick($element) {
        $element.addEventListener('click', function() {
            showModal($element)
        })
    }

    function findById (list, id) {
        return list.find( (movie) => {     /** El id que llega en findMovie es un string,  */
            return movie.id === parseInt(id, 10)  /** se debe convertir en int */
        })
    }

    function findMovie(id, category) {
        switch (category) {
            case 'action': {
                return findById(actionList, id)
            }
            case 'horror': {
                return findById(horrorList, id)
            }
            case 'mystery': {
                return findById(mysteryList, id)
            }
            default: {
                return findById(dramaList, id)
            }
        }
    }

    function showModal($element) {
        $overlay.classList.add('active')
        $modal.style.animation = 'modalIn .8s forwards'

        const id = $element.dataset.id
        const category = $element.dataset.category
        const dataOfMovie = findMovie(id, category)
        // console.log(dataOfMovie) 
           
        $modalTitle.textContent = dataOfMovie.title
        $modalImage.setAttribute('src', dataOfMovie.medium_cover_image)
        $modalDescription.textContent = dataOfMovie.description_full
    }
    function hideModal() {
        $overlay.classList.remove('active')
        $modal.style.animation = 'modalOut .8s forwards'
    }

    $hideModal.addEventListener('click', hideModal)
    

    /******************** EVENTOS DEL FORMULARIO */  
    function featuringTemplate(movieData) {
        return (`
            <div class="featuring">
                <div class="featuring-image">
                    <img src="${movieData.medium_cover_image}" width="70" height="100" alt="">
                </div>
                <div class="featuring-content">
                    <p class="featuring-title">Película encontrada</p>
                    <p class="featuring-album">${movieData.title}</p>
                </div>
            </div>
        `)
    }

    $form                                                    /**Evento cuando doy buscar */
        .addEventListener('submit', async (event) => {       /** FUNCIÓN QUE TRAE DATOS A PARTIR DEL BUSCADOR DE PELÍCULAS */
            event.preventDefault()                           /** Evita recargar la pagina al buscar una película */
            $home.classList.add('search-active')
            
            /** Cargar loader mientras responde la búsqueda */
            const $loader = document.createElement('img');
            const $loaderAtrrs = {
                src: 'src/images/loader.gif',
                width: 50,
                height: 50
            }
            
            setAttributes($loader, $loaderAtrrs)
            $featuringContainer.append($loader)  /** Cada que se busque una película, aparecerá un loader */ 

            /**Búsqueda de título de película en el form */
            const InputFormData = new FormData($form) /** Le paso el elemento del DOM $form para luego tomar el texto ingresado*/
            try {
                const {                                 /** Desestructuración de objetos */
                    data: {                             /** Se accede al objeto concreto que busco */
                        movies: movieData               /** En este caso los datos de la película que busco en el formulario */
                    }
                } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${InputFormData.get('name')}`)
                debugger
    
                const HTMLString = featuringTemplate(movieData[0])  /** Se escribe movieData[0] porque al acceder en el API, la información está en data.movies[0] */
                $featuringContainer.innerHTML = HTMLString  /** se coloca la información en pantalla para saber que encontró */
            } catch(error) {
                alert(error)
                $loader.remove()
                $home.classList.remove('search-active')
            }
        })


    /******************** TRAER Y MOSTRAR PELÍCULAS POR GÉNERO */
    function videoItemTemplate(movie, category) {
        return (`
            <div class="primaryPlaylistItem" data-id=${movie.id} data-category=${category}>
                <div class="primaryPlaylistItem-image">
                    <img src="${movie.medium_cover_image}">
                </div>
                <h4 class="primaryPlaylistItem-title">
                    ${movie.title}
                </h4>
            </div>
        `)
    }

    function renderMovieList(list, $container, category) {  // lista con los objetos -> list 
        $container.children[0].remove()     /** Elimina el loader */
        list.forEach( movieItem => {        /** Iterar en la lista que se pasó por parámetro */
            const HTMLString = videoItemTemplate(movieItem, category)       /** Creo un videoItemTemplate para cada uno de los elementos que llega en el array actionList */
            const movieElement = createHTMLTemplate(HTMLString)   /** Creo un template HTML para contener el resultado del HTMLString, que es el que contiene videoItemTemplate*/
            $container.append(movieElement)                 /** Dentro del contenedor $container coloco la información guardada en movieElement*/      

            const image = movieElement.querySelector('img')
            image.addEventListener('load', (event) => {
                event.srcElement.classList.add('fadeIn')
            })

            addEventClick(movieElement)
        });
    }

    async function cacheExist(category) {
        const listName = `${category}List`
        const cacheList = window.localStorage.getItem(listName)
        
        if(cacheList) {
            return JSON.parse(cacheList)
        }
        const { data: { movies: data } } = await getData(`${BASE_API}${LIST_GENRE}${category}`)
        window.localStorage.setItem(listName, JSON.stringify(data))

        return data
    }

    const actionList = await cacheExist('action')
    renderMovieList(actionList, $actionContainer, 'action')

    const horrorList = await cacheExist('horror')
    renderMovieList(horrorList, $horrorContainer, 'horror')

    const mysteryList = await cacheExist('mystery')
    renderMovieList(mysteryList, $mysteryContainer, 'mystery')

    const dramaList = await cacheExist('drama')
    renderMovieList(dramaList, $dramaContainer, 'drama')
    
    console.log(actionList)
    /********************  */
    /********************  */

}
load()