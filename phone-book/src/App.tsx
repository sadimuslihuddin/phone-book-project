import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";

class App extends Component {
  client: any;
  constructor(props: any) {
    super(props);

    const httpLink = new HttpLink({
      uri: "https://wpe-hiring.tokopedia.net/graphql",
    });
    console.log(httpLink);

    this.client = new ApolloClient({
      cache: new InMemoryCache({
        // VERY IMPORTANT!!
        // we're using table with name=Subscription and it will causing issue on apollo when using ___typename for caching
        // I think it because apollo has reserved word 'Subscription'
        addTypename: false,
      }),
      link: ApolloLink.from([httpLink]),
    });
  }

  render() {
    return (
      <ApolloProvider client={this.client}>
        <div className="App">
          <Dashboard />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
