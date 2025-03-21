import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import "./App.css";
import VitalsComponent from "./VitalsComponent";

// Create the http link
const httpLink = createHttpLink({
  uri: "http://localhost:4002/graphql",
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
});

function App({ onLogout }) {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <VitalsComponent onLogout={onLogout} />
      </ApolloProvider>
    </div>
  );
}

export default App;
