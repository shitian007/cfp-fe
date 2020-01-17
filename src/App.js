import React from 'react';
import SearchAppBar from './components/SearchAppBar';
import Person from './components/Person'
import Conference from './components/Conference'
import Organization from './components/Organization'
import './App.css';

export default App;

function App() {
  return (
    <div className="App">
      <Base />
    </div>
  );
}


class Home extends React.Component {
  render() {
    return (
      <div>HOME</div>
    )
  }
}

class Base extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      displayType: ''
    }
    this.search = this.search.bind(this);
  }

  displayInfo = () => {
    if (this.state.displayType === 'Person') {
      return <Person />
    } else if (this.state.displayType === 'Organization') {
      return <Organization />
    } else if (this.state.displayType === 'Conference') {
      return <Conference />
    } else {
      return <Home />
    }
  };
  search = (searchVal) => {
    console.log(searchVal);
  }

  changeDisplayType = (displayType) => {
    this.setState({
      display: displayType
    });
  }

  render() {
    return (
      <div style={{ margin: 10 }}>
        <SearchAppBar
          search={this.search}
         />
        {this.state.display}
      </div>
    )
  }
}