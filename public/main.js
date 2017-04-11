"use strict";

const obj = {id: 3, name: 'Pöllö'};
let nameVal;
let idVal;
let delVal;
let updVal;
let updNVal;

document.getElementById('deleteInput').addEventListener('input', () => {
    delVal = document.getElementById('deleteInput').value;
});

document.getElementById('idInput').addEventListener('input', () => {
    idVal = document.getElementById('idInput').value;
});

document.getElementById('nameInput').addEventListener('input', () => {
    nameVal = document.getElementById('nameInput').value;
});

document.getElementById('updateInput').addEventListener('input', () => {
    updVal = document.getElementById('updateInput').value;
});

document.getElementById('updateNameInput').addEventListener('input', () => {
    updNVal = document.getElementById('updateNameInput').value;
});
const doPost = () => {
    if(nameVal != ''){
        fetch('/user/' + nameVal + '/0', {
            method: 'post',
            body: obj
        }).then((resp) => {
            console.log(resp);
        });
    }
}

const doDelete = () => {
    if (delVal != ''){
        fetch('/user/' + delVal + '/0', {
            method: 'delete',
            body: obj
        }).then((resp) => {
            console.log(resp);
        });
    }
}

const doUpdate = () => {
    if(updVal != ''){
        fetch('/user/' + updVal + '/' + updNVal, {
            method: 'put',
            body: obj
        }).then((resp) => {
            console.log(resp);
        });
    }
}

const doGet = () => {
    if (idVal != '') {
        fetch('/user/' + idVal + '/0', {
            method: 'get',
            body: obj
        }).then((resp) => {
            console.log(resp);
        });
    }
}
