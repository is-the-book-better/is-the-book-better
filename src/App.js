import React, { Component, createRef, Fragment } from "react";
import Recents from "./Components/Recents";
import MainComp from "./Components/MainComp";
import Ratings from "./Components/Ratings";
import Description from "./Components/Description";
import axios from "axios";
import firebase from "./firebase";
import parser from "fast-xml-parser";
import Swal from "sweetalert2";

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
      voted: false,
      loading: true,
    };
    this.ref = createRef();
  }

  componentDidMount() {
    this.getRecentSearches();
    this.getVotes();
  }

  // Retrieve recent searches
  getRecentSearches = () => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const data = response.val();
      this.setState({
        recent: data.recent,
      });
    });
  };

  // Get the votes from Firebase
  getVotes = () => {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (response) => {
      const data = response.val();
      this.setState({
        ...this.state,
        booksVotes: data.books,
        moviesVotes: data.movies,
      });
    });
  };

  // Load the votes from firebase
  loadVotes = (bookId, movieId) => {
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
    }
    // eslint-disable-next-line eqeqeq
    if (
      !this.state.moviesVotes[movieId] &&
      this.state.moviesVotes[movieId] !== 0
    ) {
      let newMovieVotes = this.state.moviesVotes;
      newMovieVotes[`${movieId}`] = 0;
      dbRefMovies.set(newMovieVotes);
    }
  };

  // when Click event happens set query state as the value 
  doRecentSearch = (e) => {
    e.preventDefault();
    this.setState(
      {
        query: e.target.value,
      },
      this.searchResults
    );
  };

  // Listener for Adding vote 
  upVote = (platform, id) => {
    if (platform === "book") {
      const dbRefBooks = firebase.database().ref("books");
      let newBooks = this.state.booksVotes;
      newBooks[id] += 1;
      dbRefBooks.set(newBooks);
      const newVote = this.state.currentBookVotes + 1;
      this.setState({
        currentBookVotes: newVote,
      });
    } else if (platform === "movie") {
      const dbRefMovies = firebase.database().ref("movies");
      let newMovies = this.state.moviesVotes;
      newMovies[id] += 1;
      dbRefMovies.set(newMovies);
      const newVote = this.state.currentMovieVotes + 1;
      this.setState({
        currentMovieVotes: newVote,
      });
    }
    this.setState({
      voted: true,
    });
  };

  // Update recent searches
  updateRecentSearches = () => {
    const dbRef = firebase.database().ref("recent");
    let recent = this.state.recent;

    if (recent.length > 9 && !recent.includes(this.state.query)) {
      recent.pop();
      recent.unshift(this.state.query);
      dbRef.set(recent);
    }
  };

  // Create an axios call to MovieDB, and GoodReads, Change GoodReads API XML to JSON
  searchResults = async () => {
    this.setState({
      ...this.state,
      voted: false,
      currentBookVotes: 0,
      currentMovieVotes: 0,
    });

    try {
      const res = await axios({
        method: "GET",

        url: `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?`,

        params: {
          key: process.env.REACT_APP_GOODREADS_API_KEY,
          q: this.state.query,
        },
      });
      const books = this.parseXMLResponse(res.data);

      const bookId = books[0].best_book.id;
      const bookDetail = await axios({
        method: "GET",
        url: `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/show/${bookId}.xml?`,
        params: {
          key: process.env.REACT_APP_GOODREADS_API_KEY,
        },
      });

      const bookObj = parser.parse(bookDetail.data);
      const book = bookObj.GoodreadsResponse.book;
      const moviesApi = await axios({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        paramType: "json",
        params: {
          api_key: process.env.REACT_APP_MOVIE_API_KEY,
          language: "en-US",
          query: this.state.query,
          page: "1",
          include_adult: "false",
        },
      });

      const movies = moviesApi.data.results;
      const movie = movies[0];

      if (movie && book) {
        this.setState({
          books,
          book,
          movies,
          movie,
          loading: false,
        });
      } else {
        Swal.fire({
          title: "Please Try Again",
          text: "Try Typing Valid Movie Title",
          icon: "error",
          confirmButtonColor: "#5da9c2",
        });
      }

      this.setBookDetails();
      this.setMovieDetails();
      this.checkWhichIsBetter();
      this.ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
      Swal.fire({
        title: "Please Try Again",
        text: "Something went wrong, Try typing a movie or a book title",
        icon: "error",
        confirmButtonColor: "#5da9c2",
      });
    }
  };

  // sets Book details in state.
  setBookDetails = () => {
    if (this.state.book) {
      const popBook = { ...this.state.book };
      if (popBook.authors.author[0]) {
        this.setState({
          bookTitle: popBook.title,
          bookAuthor: popBook.authors.author[0].name,
          bookImageUrl: popBook.image_url,
          bookRating: popBook.average_rating.toFixed(1),
          bookDescription: popBook.description,
        });
      } else {
        this.setState({
          bookTitle: popBook.title,
          bookAuthor: popBook.authors.author.name,
          bookImageUrl: popBook.image_url,
          bookRating: popBook.average_rating.toFixed(1),
          bookDescription: popBook.description,
        });
      }
    }
  };

  // sets Movie details in state
  setMovieDetails = () => {
    const popMovie = { ...this.state.movie };
    this.setState({
      movieTitle: popMovie.title,
      movieImageUrl: `http://image.tmdb.org/t/p/w500/${popMovie.poster_path}`,
      movieRating: (popMovie.vote_average * 0.5).toFixed(1),
      movieDescription: popMovie.overview,
    });
  };

  // set state isBookbetter to true if the book rating is higher
  checkWhichIsBetter = () => {
    if (this.state.movieRating > this.state.bookRating) {
      this.setState({
        isBookBetter: false,
      });
    } else {
      this.setState({
        isBookBetter: true,
      });
    }
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

  // Handle the change in each type   
  handleChange = (event) => {
    this.setState({
      query: event.target.value,
    });
  };

  // when submit event is initiated  set the loading to true until the API is recieved
  handleSubmit = (event) => {
    this.setState({
      loading: true,
    });
    this.searchResults();
    event.preventDefault();
  };

  render() {
    return (
      <Fragment>
        <div className="mainWrapper">
          <header>
            <h1>Is The Book Better?</h1>
            <p>Find out if your favourite book is better than the movie </p>
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
                placeholder="Type a Book Title..."
              />
              <button type="submit" onClick={this.handleSubmit}>
                Submit
              </button>
            </form>
            <Recents
              recents={this.state.recent}
              doSearch={this.doRecentSearch}
            />
          </header>
        </div>
              {/* If Loading is true add the results */}

        {!this.state.loading ? (
          <>
            <div className="mainWrapper">
              <MainComp
                scrollRef={this.ref}
                isBookBetter={this.state.isBookBetter}
                title={this.state.bookTitle}
                movieImageUrl={this.state.movieImageUrl}
                bookImageUrl={this.state.bookImageUrl}
                bookAuthor={this.state.bookAuthor}
              />
            </div>
            <Ratings
              bookScore={this.state.bookRating}
              movieScore={this.state.movieRating}
              bookVotes={this.state.currentBookVotes}
              movieVotes={this.state.currentMovieVotes}
              upVote={(platform, id) => {
                this.upVote(platform, id);
              }}
              bookId={this.state.book.work.id}
              movieId={this.state.movie.id}
              voted={this.state.voted}
            />

            <div className="mainWrapper">
              <Description
                bookTitle={this.state.bookTitle}
                movieTitle={this.state.movieTitle}
                movieDescription={this.state.movieDescription}
                bookDescription={this.state.bookDescription}
              />
            </div>

        <footer> &copy; Satvir, Tej and Krys</footer>

          </>
        ) : null}
      </Fragment>
    );
  }
}

export default App;
