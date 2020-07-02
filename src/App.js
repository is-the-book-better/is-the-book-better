import React, { Component, Fragment } from "react";
import MainComp from "./MainComp";
import Ratings from "./Ratings";
import Description from "./Description";
import axios from "axios";
import parser from "fast-xml-parser";
import firebase from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      recent: [],
      query: "",
      isBookBetter: true,
      bookAuthor: "",
      book: {},
      booksVotes: [],
      currentBookVotes: "",
      books: [],
      bookTitle: "",
      bookImageUrl: "",
      bookRating: "",
      bookDescription: "",
      moviesVotes: [],
      currentMovieVotes: "",
      movies: [],
      movie: {},
      movieTitle: "",
      movieImageUrl: "",
      movieRating: "",
      movieDescription: "",
    };
  }

  componentDidMount() {
    this.getRecentSearches();
    this.searchResults();
    this.getVotes();
  }

  // Retrieve recent searches
  getRecentSearches() {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const data = response.val();
      this.setState({
        recent: data.recent,
      });
    });
  }

  getVotes() {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const data = response.val();
      this.setState({
        ...this.state,
        booksVotes: data.books,
        moviesVotes: data.movies,
      });
    });
  }

  loadVotes(bookId, movieId) {
    const dbRefBooks = firebase.database().ref("books");
    const dbRefMovies = firebase.database().ref("movies");

    for (let key in this.state.booksVotes) {
      // eslint-disable-next-line eqeqeq
      if (key == bookId) {
        this.setState({
          currentBookVotes: this.state.booksVotes[key],
        });
      }
    }

    for (let key in this.state.moviesVotes) {
      // eslint-disable-next-line eqeqeq
      if (key == movieId) {
        this.setState({
          currentMovieVotes: this.state.moviesVotes[key],
        });
      }
    }

    // eslint-disable-next-line eqeqeq
    if (!this.state.booksVotes[bookId] && this.state.booksVotes[bookId] != 0) {
      let newBookVotes = this.state.booksVotes;
      newBookVotes[`${bookId}`] = 0;
      dbRefBooks.set(newBookVotes);
      console.log("Updated Firebase Books!");
    }
    // eslint-disable-next-line eqeqeq
    if (
      !this.state.moviesVotes[movieId] &&
      this.state.moviesVotes[movieId] != 0
    ) {
      let newMovieVotes = this.state.moviesVotes;
      newMovieVotes[`${movieId}`] = 0;
      dbRefMovies.set(newMovieVotes);
      console.log("Updated Firebase Movies!");
    }
    // this.upvote("book", bookId);
    // this.upvote("movie", movieId);
  }

  upvote(platform, id) {
    if (platform === "book") {
      const dbRefBooks = firebase.database().ref("books");
      let newBooks = this.state.booksVotes;
      newBooks[id] += 1;
      dbRefBooks.set(newBooks);
    } else if (platform === "movie") {
      const dbRefMovies = firebase.database().ref("movies");
      let newMovies = this.state.moviesVotes;
      newMovies[id] += 1;
      dbRefMovies.set(newMovies);
    }
  }

  // Update recent searches
  updateRecentSearches() {
    const dbRef = firebase.database().ref("recent");
    let recent = this.state.recent;
    if (recent.length > 9) {
      recent.pop();
    }
    recent.unshift(this.state.query);
    dbRef.set(recent);
  }

  // googleBooks- AIzaSyCgjf_DyKEqgJhJVRvLDx8owQU-u6VHEqY
  searchResults = async () => {
    console.log(this.state.query);
    try {
      // let googleBooks = await axios({
      //   method: "GET",
      //   url: "https://www.googleapis.com/books/v1/volumes?",
      //   paramType: "json",
      //   params: {
      //     // key: "AIzaSyCgjf_DyKEqgJhJVRvLDx8owQU-u6VHEqY",
      //     q: `intitle:${this.state.query}`,
      //     // orderBy: 'relevance'
      //   }
      // })
      let res = await axios({
        method: "GET",
        url:
          "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?",
        params: {
          key: "odsRW5CclbTNlqFbZCaC4A",
          q: this.state.query,
        },
      });

      const books = this.parseXMLResponse(res.data);

      const bookId = books[0].best_book.id;
      const bookDetail = await axios({
        method: "GET",
        url: `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/show/${bookId}.xml?`,
        params: {
          key: "odsRW5CclbTNlqFbZCaC4A",
        },
      });

      let bookObj = parser.parse(bookDetail.data);
      let book = bookObj.GoodreadsResponse.book;
      console.log(book);
      let moviesApi = await axios({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        paramType: "json",
        params: {
          api_key: "4851783a531664a8fc58abf098309ada",
          language: "en-US",
          query: this.state.query,
          page: "1",
          include_adult: "false",
        },
      });

      // console.log(books);
      // const books = googleBooks.data.items;
      const movies = moviesApi.data.results;
      const movie = movies[0];
      this.setState({
        books,
        book,
        movies,
        movie,
      });
      this.getBookDetails();
      this.getMovieDetails();

      // Update recent searches if search is successful
      if (
        this.state.movieTitle !== undefined &&
        this.state.bookTitle !== undefined
      ) {
        this.updateRecentSearches();
      }
      // Load Vote Count
      this.loadVotes(this.state.book.work.id, this.state.movie.id);
    } catch (error) {
      console.log(error);
    }
  };

  getBookDetails = () => {
    if (this.state.book) {
      const popBook = { ...this.state.book };
      this.setState({
        bookTitle: popBook.title,
        bookAuthor: popBook.authors.author.name,
        bookImageUrl: popBook.image_url,
        bookRating: popBook.average_rating,
        bookDescription: popBook.description,
      });
    }
  };

  getMovieDetails = () => {
    const popMovie = { ...this.state.movies[0] };
    this.setState({
      movieTitle: popMovie.title,
      movieImageUrl: `http://image.tmdb.org/t/p/w500/${popMovie.poster_path}`,
      movieRating: popMovie.vote_average,
      movieDescription: popMovie.overview,
    });
  };

  // parse string xml received from goodreads api
  parseXMLResponse = (response) => {
    const parser = new DOMParser();
    const XMLResponse = parser.parseFromString(response, "application/xml");
    const parseError = XMLResponse.getElementsByTagName("parsererror");

    if (parseError.length) {
      this.setState({
        error: "There was an error fetching results.",
        fetchingData: false,
      });
    } else {
      const XMLresults = new Array(...XMLResponse.getElementsByTagName("work"));
      const searchResults = XMLresults.map((result) => this.XMLToJson(result));
      return searchResults;
    }
  };
  // Function to convert simple XML document into JSON.
  // Loops through each child and saves it as key, value pair
  // if there are sub-children, call the same function recursively on its children.
  XMLToJson = (XML) => {
    const allNodes = new Array(...XML.children);
    const jsonResult = {};
    allNodes.forEach((node) => {
      if (node.children.length) {
        jsonResult[node.nodeName] = this.XMLToJson(node);
      } else {
        jsonResult[node.nodeName] = node.innerHTML;
      }
    });
    return jsonResult;
  };

  handleChange = (event) => {
    this.setState({
      query: event.target.value,
    });
    // this.searchResults();
  };

  handleSubmit = (event) => {
    this.searchResults();
    event.preventDefault();
    // this.setState({
    //   query: ''
    // })
  };

  render() {
    const { movies, books } = this.state;
    const popMovie = movies[0];
    const popBook = books[0];
    // const bestBook = popBook.best_book;

    return (
      <Fragment>
        <header>
          <h1>Is the Book Better?</h1>
          <p>Enter the item below to find out</p>
          <form onSubmit={this.handleSubmit}>
            <label className="visuallyHidden" htmlFor="searchBar">
              Search Bar
            </label>
            <input
              type="search"
              name="query"
              id="searchBar"
              onChange={this.handleChange}
              value={this.state.query}
              placeholder="Enter here..."
            />
            <button type="submit" onClick={this.handleSubmit}>
              Submit
            </button>
          </form>
        </header>
        {/* {console.log(popMovie)} */}
        {/* {console.log(popBook)} */}
        {popBook && popMovie ? (
          <>
            <MainComp
              isBookBetter={this.state.isBookBetter}
              title={this.state.bookTitle}
              movieImageUrl={this.state.movieImageUrl}
              bookImageUrl={this.state.bookImageUrl}
              bookAuthor={this.state.bookAuthor}
            />
            <Ratings
              bookScore={this.state.bookRating}
              movieScore={this.state.movieRating}
              bookVotes={this.state.currentBookVotes}
              movieVotes={this.state.currentMovieVotes}
            />
            <Description
              bookTitle={this.state.bookTitle}
              movieTitle={this.state.movieTitle}
              movieDescription={this.state.movieDescription}
              bookDescription={this.state.bookDescription}
            />
          </>
        ) : (
          <p>Loading....</p>
        )}
      </Fragment>
    );
  }
}

export default App;
