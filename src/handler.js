const {nanoid} = require('nanoid');
const bookshelfs = require('./bookshelfs');

const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if(name === undefined){
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    if(readPage > pageCount){
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    const newBook = {id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt};
    bookshelfs.push(newBook);

    const isSuccess = bookshelfs.filter((book) => book.id === id).length > 0;

    if(isSuccess){
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        }).code(201);
    }

    return h.response({
        status: 'error',
        message: 'Gagal menambahkan buku'
    }).code(500);
}

const getAllBooksHandler = (request, h) => {
    const {query} = request;

    let filterBookShelf = [...bookshelfs];

    if(query.name){
        const searchName = query.name.toLowerCase();
        filterBookShelf = filterBookShelf.filter((book) => book.name.toLowerCase().includes(searchName));
    }

    if (query.reading === '0' || query.reading === '1') {
        const readingValue = query.reading === '1';
        filterBookShelf = filterBookShelf.filter((book) => book.reading === readingValue);
      }

      if (query.finished === '0' || query.finished === '1') {
        const finishedValue = query.finished === '1';
        filterBookShelf = filterBookShelf.filter((book) => book.finished === finishedValue);
      }
    return h.response({
        status: 'success',
        data: {
            books: filterBookShelf.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    }).code(200);
}

const getBooksByIdHandler = (request, h) => {
    const {id} = request.params;
    const book = bookshelfs.filter((book) => book.id === id)[0];

    if(book !== undefined){
        return h.response({
            status: 'success',
            data: {
                book
            }
        }).code(200);
    } else {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        }).code(404);
    }
}

const updateBooksByIdHandler = (request, h) => {
    const {id} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    const updatedAt = new Date().toISOString();
    const index = bookshelfs.findIndex((book) => book.id === id);

    if(name === undefined){
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    if(readPage > pageCount){
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);
    }

    if(index !== -1){
        bookshelfs[index] = {...bookshelfs[index], name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt};
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);
}

const deleteBooksByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = bookshelfs.findIndex((book) => book.id === id);

    if(index !== -1){
        bookshelfs.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);
}



module.exports = {addBooksHandler, getAllBooksHandler, getBooksByIdHandler, updateBooksByIdHandler, deleteBooksByIdHandler};

