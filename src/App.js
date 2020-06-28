import React, { Component } from "react";
import MainComp from "./MainComp"
import Ratings from "./Ratings";
import Description from "./Description"
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      books: [],
      movies: [],
    };
  }

  componentDidMount() {
    this.searchBooks();
    this.moviesApi();
  }

  moviesApi = async () => {
    try {
      let movies = await axios({
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        paramType: "json",
        params: {
          api_key: "4851783a531664a8fc58abf098309ada",
          query: `Lord of the Rings`,
        },
      });
      console.log(movies.data);
      this.setState({
        movies : movies.data
      });
    } catch (error) {
      console.log(error);
    }
  };

  searchBooks = async () => {
    try {
      let res = await axios({
        method: "GET",
        url:
          "http://cors-anywhere.herokuapp.com/https://www.goodreads.com/search/index.xml?",
        params: {
          key: "odsRW5CclbTNlqFbZCaC4A",
          q: `The DaVinci Code`,
        },
      });
      const books = this.parseXMLResponse(res.data);
      this.setState({
        books: [...books],
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
  render() {
    return (
      <div>
        {this.state.books.map((book) => {
          let bestBook = book.best_book;
          return (
            <>
              <h1>{bestBook.title}</h1>
              <p>{bestBook.author.name}</p>
            </>
          );
        })}
        <MainComp />
        <Ratings bookScore={4.59} movieScore={3.25} />
        <Description />
      </div>
    );
  }
}

export default App;
