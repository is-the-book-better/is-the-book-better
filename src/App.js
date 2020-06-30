import React, { Component, Fragment } from "react";
import MainComp from "./MainComp"
import Ratings from "./Ratings";
import Description from "./Description"
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      query: '',
      isBookBetter: true,
      bookAuthor: '',
      books: [],
      bookTitle: '',
      bookImageUrl: '',
      bookRating: '',
      bookDescription: '',
      movies: [],
      movieTitle: '',
      movieImageUrl: '',
      movieRating: '',
      movieDescription: '',
    };
  }

  componentDidMount() {
    this.searchResults();
  }

  // googleBooks- AIzaSyCgjf_DyKEqgJhJVRvLDx8owQU-u6VHEqY 
  searchResults = async () => {
    console.log(this.state.query)
    try {
      let googleBooks = await axios({
        method: "GET",
        url: "https://www.googleapis.com/books/v1/volumes?",
        paramType: "json",
        params: {
          // key: "AIzaSyCgjf_DyKEqgJhJVRvLDx8owQU-u6VHEqY",
          q: `intitle:${this.state.query}`,
          orderBy: 'relevance'
        }
      })
      // let res = await axios({
      //   method: "GET",
      //   url:
      //     "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/book/title.xml?",
      //   // "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?",
      //   params: {
      //     key: "odsRW5CclbTNlqFbZCaC4A",
      //     title: this.state.query,
      //   },
      // });

      let moviesApi = await axios({
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

      // const books = 
      const books = googleBooks.data.items;
      const movies = moviesApi.data.results;

      this.setState({
        books,
        movies
      });
      this.getBookDetails();
      this.getMovieDetails();
    } catch (error) {
      console.log(error);
    }
  };

  getBookDetails = () => {

    if (this.state.books[0]) {
      const popBook = { ...this.state.books[0].volumeInfo };
      this.setState({
        bookTitle: popBook.title,
        bookAuthor: popBook.authors[0],
        bookImageUrl: popBook.imageLinks.thumbnail,
        bookRating: popBook.averageRating,
        bookDescription: popBook.description,
      })
    }
  }

  getMovieDetails = () => {
    const popMovie = { ...this.state.movies[0] };
    this.setState({
      movieTitle: popMovie.title,
      movieImageUrl: `http://image.tmdb.org/t/p/w500/${popMovie.poster_path}`,
      movieRating: popMovie.vote_average,
      movieDescription: popMovie.overview,
    })
  }

  // parse string xml received from goodreads api
  // parseXMLResponse = (response) => {
  //   const parser = new DOMParser();
  //   const XMLResponse = parser.parseFromString(response, "application/xml");
  //   const parseError = XMLResponse.getElementsByTagName("parsererror");

  //   if (parseError.length) {
  //     this.setState({
  //       error: "There was an error fetching results.",
  //       fetchingData: false,
  //     });
  //   } else {
  //     const XMLresults = new Array(...XMLResponse.getElementsByTagName("work"));
  //     const searchResults = XMLresults.map((result) => this.XMLToJson(result));
  //     return searchResults;
  //   }
  // };
  // // Function to convert simple XML document into JSON.
  // // Loops through each child and saves it as key, value pair
  // // if there are sub-children, call the same function recursively on its children.
  // XMLToJson = (XML) => {
  //   const allNodes = new Array(...XML.children);
  //   const jsonResult = {};
  //   allNodes.forEach((node) => {
  //     if (node.children.length) {
  //       jsonResult[node.nodeName] = this.XMLToJson(node);
  //     } else {
  //       jsonResult[node.nodeName] = node.innerHTML;
  //     }
  //   });
  //   return jsonResult;
  // };

  handleChange = (event) => {
    this.setState({
      query: event.target.value
    })
    this.searchResults();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.searchResults();
    this.setState({
      query: ''
    })
  }

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
            <label className="visuallyHidden" htmlFor="searchBar">Search Bar</label>
            <input type="search" name="query" id="searchBar" onChange={this.handleChange} value={this.state.query} placeholder="Enter here..." />
            <button type="submit" onClick={this.handleSubmit}>Submit</button>
          </form>
        </header>
        {console.log(popMovie)}
        {console.log(popBook)}
        {
          popBook && popMovie ?
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
                />
              <Description
                bookTitle={this.state.bookTitle}
                movieTitle={this.state.movieTitle}
                movieDescription={this.state.movieDescription}
                bookDescription={this.state.bookDescription}
              />
            </> :
            <p>Loading....</p>
        }
      </Fragment>
    );
  }
}

export default App;
