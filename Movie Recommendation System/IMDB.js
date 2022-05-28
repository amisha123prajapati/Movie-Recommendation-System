/* Sir/Madam I used TMDB which provide all the data at the same instant without problem of loading */
/* Let me also tell about the functionality about my website
  1) You have good movies at the top and you can search for your desired movies
  2) On hovering over one of the video give you the overview page
  3) On clicking Know more your overlay window opens to present you the youtube videos
  4) You can click over the tags present at the top and can search for a movie with
     the particular combination of features/tags
  5) You can sign up in the bottom and your data is printed in the console
  6) Every link is functionable and have particular role
  */
    /*I hope you would enjoy the website
     And Atlast a great thanks to Vivek Sir and Kiruthya Maam for guiding and special thanks to @ Microsoft
      for giving such amazing opportunity and wonderful project to us which force me to learn more and more
   */

const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');



var selectedGenre = []
setGenre();
/* Sir/Madam this function is for all type of tags that I use at the top of different categories */
function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id);
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1);
                        }
                    })
                } else {
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}
/* Sir/Madam this function is used to highlight those tags which we clicked and to know which combination of tags we have clicked currently */
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}
/* Sir/Madam this function is to clear the page to default home page in case we are using some tags currently */
function clearBtn() {
    let clearBtn = document.getElementById('clear');
    if (clearBtn) {
        clearBtn.classList.add('highlight')
    } else {

        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }

}

getMovies(API_URL);
/* Sir/Madam this function is used to show the all results and if in case no such movie is found then to alert the user that no match is found */
function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentPage = data.page;
            current.innerText = currentPage;
            tagsEl.scrollIntoView({ behavior: 'smooth' })
        }
        else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }

    })

}

/* Sir/Madam this function shows the poster,ratings and overview of the movies by taking out the data */
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
        <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
        <h3>Overview</h3>
        ${overview}
        <br/> 
        <button class="know-more" id="${id}">Know More</button
        </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
            console.log(id)
            openNav(movie)
        })
    })
}

/* Sir/Madam this function search that term when we press Enter key */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre = [];
    setGenre();
    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm)
    } else {
        getMovies(API_URL);
    }

})
const overlayContent = document.getElementById('overlay-content');
/* Sir/Madam this function is used to show all the related youtube videos regarding that particular movie */
function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/' + id + '/videos?' + API_KEY).then(res => res.json()).then(videoData => {
        console.log(videoData);
        if (videoData) {
            document.getElementById("myNav").style.width = "100%";
            if (videoData.results.length > 0) {
                var embed = [];
                var dots = [];
                videoData.results.forEach((video, idx) => {
                    let { name, key, site } = video

                    if (site == 'YouTube') {

                        embed.push(`
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        
                        `)

                        dots.push(`
                        <span class="dot">${idx + 1}</span>
                        `)
                    }
                })

                var content = `
                <h1 class="no-results">${movie.original_title}</h1>
                <br/>
                
                ${embed.join('')}
                <br/>
                <div class="dots">${dots.join('')}</div>
                
                `
                overlayContent.innerHTML = content;
                activeSlide = 0;
                showVideos();
            } else {
                overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            }
        }
    })
}

/* Sir/Madam this function Closes the Youtube video part when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;

function showVideos() {
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');

    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, idx) => {
        if (activeSlide == idx) {
            embedTag.classList.add('show')
            embedTag.classList.remove('hide')

        } else {
            embedTag.classList.add('hide');
            embedTag.classList.remove('show')
        }
    })

    dots.forEach((dot, indx) => {
        if (activeSlide == indx) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active')
        }
    })
}


/* Sir/Madam this function changes the colour of the rating part according to the value of rating */
function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return "orange"
    } else {
        return 'red'
    }
}
/* Sir/Madam this is the contact form  */
var signUp = document.getElementById('SignContact');
signUp.addEventListener('submit', function (event) {
    event.preventDefault()


    var firstname = document.getElementById('first').value
    console.log(firstname)
    var lastname = document.getElementById('last').value
    console.log(lastname)
    var emailId = document.getElementById('email').value
    console.log(emailId)
    var mobileNo = document.getElementById('mobile').value
    console.log(mobileNo)
    var Npassword = document.getElementById('Npassword').value
    console.log(Npassword)
    var Cpassword = document.getElementById('Cpassword').value
    console.log(Cpassword)
});




