
const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'bookshelf-apps';


/* =========================================================================== */
/* ============================ [ main function ] ============================ */
/* =========================================================================== */

function addBook() {
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookCategory = document.getElementById('category').value;
    const yearOfPublication = document.getElementById('year').value;
    const coverbookLink = document.getElementById('cover').value;
    const completedReading = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, bookTitle, bookAuthor, bookCategory, yearOfPublication, coverbookLink, completedReading);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, category, yearOfPublication, coverbookLink, completedReading) {
    return {
        id,
        title,
        author,
        category,
        yearOfPublication,
        coverbookLink,
        completedReading
    }
}

function makeBooksElement(bookObject) {
    /* ========= [ create book continer ] ========= */
    const objectContainer = document.createElement('article');
    objectContainer.classList.add('book_item');

    const bookItemImage = document.createElement('img');
    bookItemImage.src = bookObject.coverbookLink ; bookItemImage.alt = 'cover';
    bookItemImage.addEventListener('error',()=>{
        bookItemImage.src = 'assets/img/cover-default.jpg';
        console.log('Kesalahan saat memuat gambar ')
    })

    /* ========= [ create book description ] ========= */
    const bookItemDescription = document.createElement('div');
    bookItemDescription.classList.add('desc');
    const boldStyleTitle = document.createElement('strong');
    boldStyleTitle.innerText = bookObject.title;
    // [ bookTitle ] ========
    const bookItemTitle = document.createElement('p');
    bookItemTitle.append(boldStyleTitle);
    const newLine = document.createElement('br');
    // [ bookAuthor ] =======
    const bookItemAuthor = document.createElement('p');
    bookItemAuthor.innerText = bookObject.author;
    // [ bookCategory ] =====
    const bookItemCategory = document.createElement('p');
    bookItemCategory.innerText = bookObject.category;
    // [ yearOfPublication ] =
    const bookItemYear = document.createElement('p');
    bookItemYear.innerText = bookObject.yearOfPublication;

    bookItemDescription.append(bookItemTitle, newLine, bookItemAuthor, bookItemCategory, bookItemYear);
    objectContainer.append(bookItemImage, bookItemDescription);
    objectContainer.setAttribute('id', `book-${bookObject.id}`);


    /* ========= [ create button continer ] ========= */
    const bookButtonsContainer = document.createElement('div');
    bookButtonsContainer.classList.add('action');
    // [ delete button ] ===
    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/img/icon/bin-16.png'; deleteIcon.alt =  'delete';
    deleteButton.append(deleteIcon);
    // [edit button ] ======
    const editButton = document.createElement('button');
    const editIcon = document.createElement('img');
    editIcon.src = 'assets/img/icon/edit-16.png';editIcon.alt = 'edit';
    editButton.append(editIcon);

    /* ============= [ create read or un-read button ] ============== */
    if (bookObject.completedReading) {
        // [ create un-read button ] ===
        const unreadButton = document.createElement('button');
        const unreadIcon = document.createElement('img')
        unreadIcon.src = 'assets/img/icon/check-16.png' ; unreadIcon.alt = 'unread' ;
        unreadButton.append(unreadIcon);
        bookButtonsContainer.append(unreadButton, editButton, deleteButton);
        objectContainer.append(bookButtonsContainer);
        // EVENT 
        unreadButton.addEventListener('click',() => {
            bookObject.completedReading = reverseTheReadStatus(bookObject.completedReading);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        })

    } else {
        // [ create read button ] ====
        const readButton = document.createElement('button');
        const readIcon = document.createElement('img')
        readIcon.src = 'assets/img/icon/checkmark-16.png' ; readIcon.alt = 'read';
        readButton.append(readIcon);
        bookButtonsContainer.append(readButton, editButton, deleteButton);
        objectContainer.append(bookButtonsContainer);
        // EVENT
        readButton.addEventListener('click', () => {
            bookObject.completedReading = reverseTheReadStatus(bookObject.completedReading);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
        })
    }

    /* =================== [ clear position ] ===================== */
    const clearElmenet = document.createElement('div');
    clearElmenet.classList.add('clear');
    objectContainer.append(clearElmenet) ;

    /* =================== [ add event for EDIT and DELETE ] ===================== */
    deleteButton.addEventListener('click', () => {
        deleteBookFromList(bookObject.id);
    });
    editButton.addEventListener('click', () => {
        editBook(bookObject.id);
    })

    return objectContainer;
}

function reverseTheReadStatus(readStatus) {
    return readStatus ? false : true;
}

function editBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    // REVISIEUN
    alert("Isikan data baru, untuk Melakukan Update");
    alert("Kosongkan data, jika tidak ada perubahan data");
    const newTitle = prompt("Judul Buku") ; 
    const newAuthor = prompt("Penulis Buku");
    const newCategory = prompt("Category Buku");
    const newYearOfPublication = parseInt(prompt("Tahun Publikasi"));
    const newCoverbookLink = prompt("Link Cover Buku");

    bookTarget.title = newTitle != '' ? newTitle : bookTarget.title;
    bookTarget.author = newAuthor != '' ? newAuthor : bookTarget.author;
    bookTarget.category = newCategory != '' ? newCategory  : bookTarget.category
    bookTarget.yearOfPublication = newYearOfPublication != '' ? newYearOfPublication : bookTarget.yearOfPublication ;
    bookTarget.coverbookLink = newCoverbookLink !='' ? newCoverbookLink : bookTarget.coverbookLink;

    // SAVE and UPDATE
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBookFromList(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    clearSearchElement();
    saveData();
}

function findBookTitle(bookTitle) {
    const result = [ ];
    for (let bookItem of books) {
        if (bookItem.title.toLocaleLowerCase().includes(bookTitle.toLowerCase())) {
            result.push(bookItem);
        } 
    }
    return ( result != [ ] ? result : false ) ;
}

function findBook(bookId) {
    for (let bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function clearSearchElement(){
    const searchBookshelfList = document.getElementById('searchBookshelfList');
    searchBookshelfList.innerHTML = '';
}

function renderListOfSearch(searchTitle){
    // [ List Hasil pencarian ] =======
    const searchBookshelfList = document.getElementById('searchBookshelfList');
    searchBookshelfList.innerHTML = ''; 

    const notifSearch = document.createElement('span');  
    searchBookshelfList.append(notifSearch);
    const listOfBooksResultsFromSearch = findBookTitle(searchTitle);

    if (searchTitle != ''){
        // [ RENDER ]======
        notifSearch.innerText = `Hasil pencarian judul buku : ${searchTitle}` ;
        for (const bookItem of listOfBooksResultsFromSearch){
            const bookElement = makeBooksElement(bookItem);
            searchBookshelfList.append(bookElement);
        }
    } else {
        searchBookshelfList.innerText = `Tidak Menemukan Buku Dengan Judul : '${searchTitle}'`; 
    }
    
}

/* =========================================================================== */
/* ========================== [ function for Web-Storage ] =================== */
/* =========================================================================== */

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let bookData = JSON.parse(serializedData);
    
    if (bookData !== null) {
        for (const bookItem of bookData) {
            books.push(bookItem);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


/* =================================================================== */
/* ============================ [ event ] ============================ */
/* =================================================================== */

document.getElementById('searchBox').addEventListener('change', () => {
    const searchTitle = document.getElementById('searchBox').value ;    
    // [ call rendre function  ]
    renderListOfSearch(searchTitle);
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, () => {
    const readedBookList = document.getElementById('completeBookshelfList');
    readedBookList.innerHTML = '';

    const unreadBookList = document.getElementById('incompleteBookshelfList');
    unreadBookList.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBooksElement(book);  // buat tampilan dengan HTML
        if (book.completedReading) {
            readedBookList.append(bookElement);
        } else {
            unreadBookList.append(bookElement);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    };
});
