'use strict';

let originalData = null;
let map = null;
let marker = null;

document.querySelector('#reset-button').addEventListener('click', () => {
    update(originalData);
});

const createCard = (image, title, texts) => {
    let text = '';
    for (let t of texts){
        text += `<p class="card-text">${t}</p>`;
    }

    return `<img class="card-img-top" src="${image}" alt="">
            <div class="card-block">
                <h3 class="card-title">${title}</h3>
                ${text}                
            </div>
            <div class="card-footer">
                <p><button class="btn btn-primary">View</button></p>
            </div>`;
};

const categoryButtons = (items) => {
    items = removeDuplicates(items, 'category');
    document.querySelector('#categories').innerHTML = '';
    for (let item of items) {
        const button = document.createElement('button');
        button.class = 'btn btn-secondary';
        button.innerText = item.category;
        document.querySelector('#categories').appendChild(button);
        button.addEventListener('click', () => {
            sortItems(originalData, item.category);
        });
    }
};

const sortItems = (items, rule) => {
    const newItems = items.filter(item => item.category === rule);
    // console.log(newItems);
    update(newItems);
};

const getData = (params) => {
    fetch('/posts')
        .then(response => {
            return response.json();
        })
        .then(items => {
            originalData = items;
            update(items);
        });
    if(params != null){
        fetch('/posts/' + params)
            .then(response => {
                return response.json();
            })
            .then(items => {
                originalData = items;
                console.log(items);
                update(items);
            });
    }
};


const removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
};

const update = (items) => {
    categoryButtons(items);
    document.querySelector('.card-deck').innerHTML = '';
    for (let item of items) {
        // console.log(item);
        const article = document.createElement('article');
        article.setAttribute('class', 'card');
        const time = moment(item.time);
        article.innerHTML = createCard(item.thumbnail, item.title, ['<small>'+time.format('dddd, MMMM Do YYYY, HH:mm')+'</small>', item.details]);
        article.addEventListener('click', () => {
            document.querySelector('.modal-body img').src = item.image;
            document.querySelector('.modal-title').innerHTML = item.title;
            resetMap(item);
            document.querySelector('#map').addEventListener('transitionend', () => {
                resetMap(item);
            });
            const myModal = $('#myModal');
            myModal.on('shown.bs.modal', () => {
                resetMap(item);
            });
            myModal.modal('show');
        });
        document.querySelector('.card-deck').appendChild(article);
    }
    createOptions(items);
    initDeleteCat(items)
};

const initDeleteCat = (items) => {
    let deleteSelection = '';
    const catDelete = document.getElementById('deleteJumbo');
    for (let item of items) {
        deleteSelection += `<option cat-id="`+ item.id +`">${item.title}</option>`;
    }
    catDelete.innerHTML = deleteSelection;
    catDelete.addEventListener('change', () => {
        document.getElementById('deleteFormCatId').value = items[catDelete.selectedIndex]._id;
        document.getElementById('deleteTitle').innerHTML = items[catDelete.selectedIndex].title;
        document.getElementById('deleteCategory').innerHTML = items[catDelete.selectedIndex].category;
        document.getElementById('deleteDetails').innerHTML = items[catDelete.selectedIndex].details;
        document.querySelector('#deleteImg').src = items[catDelete.selectedIndex].thumbnail;
    });
}

const createOptions = (items) =>{

    let selection = '';
    const catSelect = document.getElementById('editJumbo');
    for (let item of items) {
        selection += `<option cat-id="`+ item.id +`">${item.title}</option>`;
    }
    catSelect.innerHTML = selection; 
    catSelect.addEventListener('change', () => {
    document.getElementById('formCatId').value = items[catSelect.selectedIndex]._id;
    document.getElementById('editTitle').value = items[catSelect.selectedIndex].title;
    document.getElementById('editCategory').value = items[catSelect.selectedIndex].category;
    document.getElementById('editDetails').value = items[catSelect.selectedIndex].details;
});

    /*const editUpdate = document.getELementById('editUpdate');
    editUpdate.addEventListener('click', () => {
        document.getElementById('formCatId').value = items[catSelect.selectedIndex]._id;
        document.getElementById('editTitle').value = items[catSelect.selectedIndex].title;
        document.getElementById('editCategory').value = items[catSelect.selectedIndex].category;
        document.getElementById('editDetails').value = items[catSelect.selectedIndex].details;
    });*/
}

const initMap = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11
    });
    marker = new google.maps.Marker({
        map: map
    });
    getData();
};

const resetMap = (item) => {
    const coords = item.coordinates;
    console.log(coords);
    google.maps.event.trigger(map, "resize");
    map.panTo(coords);
    marker.setOptions({
        position: coords
    });
};

initMap();
// delete existing object
document.querySelector('#spyDeleteForm').addEventListener('submit', (evt) => {
   evt.preventDefault();
   const data = new FormData(evt.target);
   deleteData(data, '/delete');
});


// update existing object
document.querySelector('#spyEditForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.target);
    /*
    const fileElement = event.target.querySelector('input[type=file]');
    const file = fileElement.files[0];
    data.append('file', file);
    */
    postData(data, '/update');
});

const validateForm = (data) => {
    if(data.title != '' && data.details != '' && data.category != ''){
    }
}

const initSearch = () => {
    const search = document.getElementById('search');
    search.addEventListener('input', (evt) => {
        if(search.value != ''){
            getData(search.value);
        }
        else {
            getData();
        }
    });
}


// add new
document.querySelector('#spyForm').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.target);
    const fileElement = event.target.querySelector('input[type=file]');
    const file = fileElement.files[0];
    data.append('file', file);
    postData(data, '/new')
});

const deleteData = (data, url) => {
    fetch(url, {
        method: 'delete',
        body: data
    }).then((respo) => {
        getData();
        $('#myTabs a:first').tab('show');
    });
}

const postData = (data, url) => {
        fetch(url, {
            method: 'post',
            body: data
        }).then((resp) => {
            getData();
            $('#myTabs a:first').tab('show');
        });
}


// init tabs
$('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

initSearch();