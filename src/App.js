import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import Person from './components/Person'
import Conference from './components/Conference'
import Organization from './components/Organization'
import Home from './components/Home'
import SearchPage from './components/SearchPage'
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
  }

  componentDidMount() {
    document.title = "CFP Mining";
  }

  search = (searchVal) => {
    this.props.history.push('/search/' + searchVal);
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <SearchAppBar
          search={this.search}
        />
        <Switch>
          <Route path='/' exact>
            <Home />
          </Route>
          <Route path='/search/:searchVal' render={(props) =>
            <SearchPage/>
          } />
          <Route path='/person/:id' render={(props) =>
            <Person/>
          } />
          <Route path='/org/:id' render={(props) =>
            <Organization/>
          } />
          <Route path='/conf/:id' render={(props) =>
            <Conference/>
          } />
        </Switch>
      </div >
    )
  }
}

let RoutedBase = withRouter(Base);