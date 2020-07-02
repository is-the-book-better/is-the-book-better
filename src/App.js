import React, { Component, Fragment, createRef } from "react";
import MainComp from "./MainComp";
import Ratings from "./Ratings";
import Description from "./Description";
import axios from "axios";
import parser from 'fast-xml-parser';
import Swal from 'sweetalert2'

class App extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      isBookBetter: true,
      bookAuthor: '',
      book: {},
      books: [],
      bookTitle: '',
      bookImageUrl: '',
      bookRating: '',
      bookDescription: '',
      movies: [],
      movie: {},
      movieTitle: '',
      movieImageUrl: '',
      movieRating: '',
      movieDescription: '',
      loading: true
    };
    this.ref = createRef();
  }

  // componentDidMount() {

  // }

  searchResults = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?`,
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
          key: "odsRW5CclbTNlqFbZCaC4A"
        }
      })
      const bookObj = parser.parse(bookDetail.data);
      const book = bookObj.GoodreadsResponse.book;
      const moviesApi = await axios({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        paramType: "json",
        params: {
          api_key: "4851783a531664a8fc58abf098309ada",
          language: 'en-US',
          query: this.state.query,
          page: '1',
          include_adult: 'false',
        },
      });
      const movies = moviesApi.data.results;
      const movie = movies[0];

      if (!movie) {
        Swal.fire({
          title: 'Please Try Again',
          text: 'Try Typing Valid Movie Title',
          icon: 'error',
          confirmButtonColor: '#5da9c2',
        })
      } else if (!book) {
        Swal.fire({
          title: 'Please Try Again',
          text: 'Try Typing Valid Book Title',
          icon: 'error',
          confirmButtonColor: '#5da9c2',
        })
      }

      this.setState({
        books,
        book,
        movies,
        movie,
        loading: false
      });

      this.getBookDetails();
      this.getMovieDetails();
      this.checkWhichIsBetter();
      this.ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } catch (error) {
      Swal.fire({
        title: 'Please Try Again',
        text: 'Something went wrong, Try typing a movie or a book title',
        icon: 'error',
        confirmButtonColor: '#5da9c2',
      })
    }
  };

  getBookDetails = () => {
    if (this.state.book) {
      const popBook = { ...this.state.book };
      this.setState({
        bookTitle: popBook.title,
        bookAuthor: popBook.authors.author.name,
        bookImageUrl: popBook.image_url,
        bookRating: (popBook.average_rating).toFixed(1),
        bookDescription: popBook.description,
      })
    }
  }

  getMovieDetails = () => {
    const popMovie = { ...this.state.movie };
    this.setState({
      movieTitle: popMovie.title,
      movieImageUrl: `http://image.tmdb.org/t/p/w500/${popMovie.poster_path}`,
      movieRating: (popMovie.vote_average * 0.5).toFixed(1),
      movieDescription: popMovie.overview,
    })
  }

  checkWhichIsBetter = () => {
    if (this.state.movieRating > this.state.bookRating) {
      this.setState({
        isBookBetter: false
      })
    } else {
      this.setState({
        isBookBetter: true
      })
    }
  }

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
      query: event.target.value
    })
  }

  handleSubmit = (event) => {
    this.setState({
      loading: true
    })
    this.searchResults();
    event.preventDefault();
  }


  render() {

    return (

      <Fragment>

        <header>
          <h1>Is the Book Better?</h1>
          <p>Enter the item below to find out</p>
          <form onSubmit={this.handleSubmit}>
            <label className="visuallyHidden" htmlFor="searchBar">Search Bar</label>
            <input type="search" name="query" id="searchBar" onChange={this.handleChange} value={this.state.query} placeholder="Enter here..." />
            <button type="submit" onClick={this.handleSubmit}>Submit</button>
          </form>
        </header>
        {
          !this.state.loading ?
            <>
              <MainComp
                scrollRef={this.ref}
                isBookBetter={this.state.isBookBetter}
                title={this.state.bookTitle}
                movieImageUrl={this.state.movieImageUrl}
                bookImageUrl={this.state.bookImageUrl}
                bookAuthor={this.state.bookAuthor}
              />
              <Ratings
                bookScore={this.state.bookRating}
                movieScore={this.state.movieRating}
              />
              <Description
                bookTitle={this.state.bookTitle}
                movieTitle={this.state.movieTitle}
                movieDescription={this.state.movieDescription}
                bookDescription={this.state.bookDescription}
              />
            </> :
            null
        }
      </Fragment>
    );
  }
}

export default App;
