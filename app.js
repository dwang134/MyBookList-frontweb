//Book Class: Represents a book for intializing new book objects
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//UI Class: handle UI Tasks
class UI {


  static displayBooks() {

    const books = Store.getBooks();

    //create two Store Book Objects
    // const StoreBooks = [
    //   { title: "The Chrysalid", author: "John Wyndham", isbn: "34234" },
    //   { title: "The Outsiders", author: "S. E. Hinton", isbn: "123231" }
    // ];


    //for each book object call the addBookToList function passing it as a parameter
    //method1 for each and arrow function operator
    //books.forEach((book) => UI.addBookToList(book));

    //method2 for look from length and pass index of array
    // for (let i= 0; i < StoreBooks.length; i++) {
    //   UI.addBookToList(StoreBooks[i]);
    // }
    
    //method3 you loop for each element in books
    for (var element of books){
      UI.addBookToList(element); 
    }
    
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    //method1
    var row = '<tr>';

    row+= `<td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td><a href = "#" class= "btn btn-danger btn-sm delete">X</td>`;
    row+= '</tr>';
    
    list.innerHTML+= row; 

    //method2
    /*
    const row = document.createElement("tr"); // ALWAYS CHECK SYNTAX
    row.innerHTML = `<td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td><a href = "#" class= "btn btn-danger btn-sm delete">X</td>`;
    list.innerHTML+= row.innerHTML;
    //list.appendChild(row);
    */
  }

  //set value of strings back to empty strings
  static clearField(){
    document.querySelector('#title').value= '';
    document.querySelector('#author').value= '';
    document.querySelector('#isbn').value= '';
  }

  //delete ze book el = element
  static deleteBook(el){
    //if element's classlist has class delete
    //keep in mind this is a href ref tag and parent of that will be Table data tag
    //parent of td will be tr which is what we are isolating for
    if (el.classList.contains('delete')){
      //can use parentNode but this one checks if parent exists if not then = null
      el.parentElement.parentElement.remove();
    }
  }


  //class = "alert alert-sucess" this is a bootstrap alert styling 
  //going to pass the message we want to display when encountering alert-${success/fail}
  static showAlert(message, className){
    const div = document.createElement('div');
    div.className= `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    var parentPos = document.querySelector(' .container'); //dont need to list tag name just locate id/class name
    var childPos = document.querySelector(' #book-form');
    parentPos.insertBefore(div, childPos);

    //make it go away after 3 seconds 
    setTimeout(() => document.querySelector('.alert').remove(), 2000);

  }

}

//Store: Handles Storage
class Store{

  static getBooks(){
    let books;
    if (localStorage.getItem('books') === null){
      books= [];
    }else{
      //going to be stored as a string
      //books = localStorage.getItem('books');
      //access as a js array using JSON
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  } 

  static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    //needs to convert to a string toString()..?
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    
    const books = Store.getBooks();
    
    books.forEach((book, index)=> {
      if (books.isbn === isbn){
        books.splice(index, 1);
      }
    });


    localStorage.setItem('books', JSON.stringify(books));
  }



}



//Event: Display Book
//when dom tree is loaded .. windows.onload? , call UI class and displayBook Method
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
//grab the book form and when the submit event triggers (e) then get the value
document.querySelector('#book-form').addEventListener('submit', (e) => {

  //because submit event need to prevent default actual submit im guessing this is preventing it from submitting it to an actual destination .php
  e.preventDefault();

  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  //do some validation here
  //if (title === '' || )
  if ((title && author && isbn) === ''){
    UI.showAlert("Please complete any missing fields", "danger"); //remember this method is in the CLASS!

  }else{

     //instantiate a book object --> intialize?
      const book = new Book(title,author,isbn);
      
      //add book to UI
      UI.addBookToList(book);

      //add book to store local storage
      Store.addBook(book);

      //clear the field bro
      UI.clearField();

      UI.showAlert("Book is added!", "success");
  }
  //messing with ternary



  //Event: Remove a Book (how? first thing comes to mind is to isolate and listen to the event when you click that red x button)
  //however issue being that if you listen to that there are multiple of them on the page and all of them will be deleted
  //solution is to 
  document.querySelector('#book-list').addEventListener('click', (e) => {
    
    UI.deleteBook(e.target)

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    UI.showAlert('Book Removed', 'info')
  });


})