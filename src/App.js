import React, { Component } from "react";
import Ratings from "./Ratings";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      query: 'the Davinci Code',
      books: [],
      movies: [],
    };
  }

  componentDidMount() {
    this.searchResults();
    // this.searchBooks();
    // this.searchMovies();
  }

  // searchBooks = () => {
  //   axios({
  //     method: "GET",
  //     url:
  //       "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?",
  //     params: {
  //       key: "odsRW5CclbTNlqFbZCaC4A",
  //       q: this.state.query,
  //     },
  //   }).then(res => {
  //     const books = this.parseXMLResponse(res.data);
  //     this.setState({
  //       books
  //     })
  //   })
  // }

  // searchMovies = () => {
  //   axios({
  //     method: "GET",
  //     url: "https://api.themoviedb.org/3/search/movie?",
  //     paramType: "json",
  //     params: {
  //       api_key: "4851783a531664a8fc58abf098309ada",
  //       query: this.state.query,
  //     },
  //   }).then(res => {
  //     const movies = res.data.results;
  //     this.setState({
  //       movies
  //     })
  //   })
  // }

  searchResults = async () => {
    console.log(this.state.query)
    try {
      let res = await axios({
        method: "GET",
        url:
          "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?",
        params: {
          key: "odsRW5CclbTNlqFbZCaC4A",
          q: this.state.query,
        },
      });

      let moviesApi = await axios({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        paramType: "json",
        params: {
          api_key: "4851783a531664a8fc58abf098309ada",
          query: this.state.query,
        },
      });

      const books = this.parseXMLResponse(res.data);
      const movies = moviesApi.data.results;
      console.log(books)
      this.setState({
        books,
        movies
      });
    } catch (error) {
      console.log(error);
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

  handleChange = (event) => {
    this.setState({
      query: event.target.value
    })
  }
  handleSubmit = () => {
    this.searchBooks(this.state.query);
    console.log(this.state.query);
    this.setState({
      query: ''
    })
  }
  render() {
    const { movies, books } = this.state;
    const popMovie = movies[0];
    const popBooks = books[0];
    return (
      <header>
        <h1>Is the Book Better?</h1>
        <p>Enter the item below to find out</p>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="searchBar">Search Bar</label>
          <input type="search" name="query" id="searchBar" onChange={this.handleChange} value={this.state.query} />
          <button type="submit" onClick={this.handleSubmit}>Submit</button>
        </form>
        {console.log(popMovie)}
        {console.log(popBooks)}

        <Ratings bookScore={4.59} movieScore={3.25} movie={popMovie} books={popBooks} />
      </header>
    );
  }
}

export default App;
