import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Importez BrowserRouter, Route et Switch
import FileViewer from './pages/MainPage';
import Graphique from './pages/Graphique'; // Importez votre composant GraphPage
import logo from "./assets/logo_e.png"

function App() {
  return (
    <Router>
      <div className="App">
        <img src={logo} alt='logo_e_emotum' className='App-logo' style={{margin: "20px"}}/>
        {/* Utilisez Switch pour rendre uniquement la première route correspondante */}
        <Switch>
          <Route path="/" exact component={FileViewer} /> {/* Route pour MainPage */}
          <Route path="/graph" component={Graphique} /> {/* Route pour GraphPage */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;