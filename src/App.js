import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import Person from './components/Person';
import Conference from './components/Conference';
import Organization from './components/Organization';
import Home from './components/Home';
import SearchPage from './components/SearchPage';
import About from './components/About';
import { CircularProgress, Box } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import './App.css';

export default App;

function App() {
  return (
    <div className="App">
      <Router>
        <RoutedBase />
      </Router>
    </div>
  );
}

class Base extends React.Component {

  constructor(props) {
    super(props)
    this.search = this.search.bind(this);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    document.title = "CFP Mining";
  }

  search = (searchVal) => {
    this.props.history.push('/search/' + searchVal);
  }

  setLoadingState = (loadingState) => {
    this.setState({
      loading: loadingState
    });
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <SearchAppBar
          search={this.search}
        />
        <Box
          display={this.state.loading ? "flex" : "none"}
          justifyContent="center"
          style={{ margin: 100 }}
        >
          <CircularProgress size={40} />
        </Box>
        <Box visibility={this.state.loading ? "hidden" : "visible"}>
          <Switch>
            <Route path='/(home|)' exact render={(props) =>
              <Home setLoadingState={this.setLoadingState} />
            } />
            <Route path='/about' exact render={(props) =>
              <About setLoadingState={this.setLoadingState} />
            } />
            <Route path='/search/:searchVal' render={(props) =>
              <SearchPage setLoadingState={this.setLoadingState} />
            } />
            <Route path='/person/:id' render={(props) =>
              <Person setLoadingState={this.setLoadingState} />
            } />
            <Route path='/org/:id' render={(props) =>
              <Organization setLoadingState={this.setLoadingState} />
            } />
            <Route path='/conf/:id' render={(props) =>
              <Conference setLoadingState={this.setLoadingState} />
            } />
          </Switch>
        </Box>
      </div >
    )
  }
}

let RoutedBase = withRouter(Base);