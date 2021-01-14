/** PROMESA: Callback o llamada a un Servicio Web que devuelve 'algo' para ser usado en mi app */
const SEGUNDOS = 10000;
let timeout = Math.random() * SEGUNDOS
const getUser = new Promise(function (promesaExitosa, promesaRechazada){  /** Promise: recibe una función como parámetro que a su vez recibe dos funciones como parámetro */
    if(timeout < 6000) {
        setTimeout(function(){
            promesaExitosa()
        }, timeout)
    } else {
        setTimeout(function() {
            promesaRechazada('Se acabó el tiempo')
        },5000)
    }
})
//console.log(timeout) /** Para saber cuánto tiempo tarda */
getUser
    .then(function() {
        //console.log('Promesa exitosa!!')
    })
    .catch(function(message) {
        //console.log(message)
    })
/*
 * 
 * 
 *
 * * /

/*** AJAX & FETCH - JQUERY & VANILLA.JS */
$.ajax('https://randomuser.me/api/', {   /** AJAX DEVUELVE UN OBJETO */
    method: 'GET',
    success: function (data) {
        //console.log('USER DATA 1: ', data)
    },
    error: function (error) {
        //console.log(error)
    }
})

fetch('https://randomuser.me/api/')  /** LA DIFERENCIA ES QUE FETCH DEVUELVE UNA PROMESA */
    .then(function (response) {
        //console.log(response)   /** CUANDO LA PROMESA SE RESUELVE, */
        //return response.json()  /** PUEDO LEER Y PARSEAR EL CONTENIDO */
    })
    .then(function(userData) {        /** LEER Y PARSEAR ES CASI DECIR QUE SE */
        //console.log('user Data 2: '   /** TRANSFORMÓ LA INFORMACIÓN EN UN OBJETO */
        //, userData.results[0].name.title
        //, userData.results[0].name.first
        //, userData.results[0].name.last )  
    })
    .catch(function(error) {
        console.log(error)
    })
/**
 * 
 * 
 * 
 */
/**ASINCRONÍSMO EN JS CON ASYNC AWAIT */

/** SOLUCIÓN ALTERNA CON FETCH...THEN...CATCH */
// let horrorList = getMoviesData('https://yts.lt/api/v2/list_movies.json?genre=horror')
//     .then(function(data) {
//         horrorList = data
//         console.log('Horror List', horrorList)
//     })

async function load() {
    
    /** SOLUCIÓN DIRECTA CON ASYNC - AWAIT */
    // const response = await fetch('https://yts.lt/api/v2/list_movies.json')
    // const data = await response.json()
    // console.log(data)
    const $actionContainer = document.getElementById('action')
    const $horrorContainer = document.getElementById('horror')
    const $animationContainer = document.getElementById('animation')

    const $home = document.getElementById('home')    
    const $featuringContainer = document.getElementById('featuring')
    const $form = document.getElementById('form')
    const $overlay = document.getElementById('overlay')

    const $modal = document.getElementById('modal')
    const $modalTitle = $modal.querySelector('h1')
    const $modalImage = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')
    const $hideModal = document.getElementById('hideModal')
    
    async function getMoviesData(url) {
        const response = await fetch(url)
        const data = await response.json()
        return data
    }

    const URL = 'https://yts.lt/api/v2/list_movies.json?'
    const actionList = await getMoviesData(`${URL}genre=action`)
    const horrorList = await getMoviesData(`${URL}genre=horror`)
    const animationList = await getMoviesData(`${URL}genre=animation`)
    // console.log(actionList,horrorList,animationList) // prueba de datos
    function videoItemTemplate(movie) {
        return (`
            <div class="primaryPlaylistItem">
                <div class="primaryPlaylistItem-image">
                    <img src="${movie.medium_cover_image}">
                </div>
                <h4 class="primaryPlaylistItem-title">
                    ${movie.title}
                </h4>
            </div>
        `)
    }
    
    actionList.data.movies.forEach( movieItem => {           /** Se recorre cada item con un foreach */
        const HTMLString = videoItemTemplate(movieItem)      /** pasando por cada uno de los elemento que llegan en array */
        const html = document.implementation.createHTMLDocument()   /** se colocan dentro del html que se crea para que lea el texto plano */
        html.body.innerHTML = HTMLString                            /** y por el html creado se lee y se muestra de manera correcta  */
        
        //$actionContainer.append(HTMLString)
        console.log(`${HTMLString}`)
    });


}
load()