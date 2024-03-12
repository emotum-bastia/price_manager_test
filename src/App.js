import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Importez BrowserRouter, Route et Switch
import FileViewer from './pages/MainPage';
import Graphique from './pages/Graphique'; // Importez votre composant GraphPage
import { db } from "./functions/dbConnection"
import { useEffect, useState } from 'react';
import { getDocs, collection } from "firebase/firestore";
import Load from './pages/Load';


function App() {



  return (
    <Router>
      <div className="App">

        <Switch>
          <Route path="/" exact component={FileViewer} /> {/* Route pour MainPage */}
          <Route path="/graph" component={Graphique} /> {/* Route pour GraphPage */}
          <Route path="/Load" component={Load} /> {/* Route pour Load */}
          <Route path="/load" component={Load} /> {/* Route pour Load */}
          <Route path="/loads" component={Load} /> {/* Route pour Load */}
          <Route path="/Loads" component={Load} /> {/* Route pour Load */}
          <Route>
            <div>
              <h1>Erreur 404: page inconnue</h1>
              <a href='/' className='btn'>retour page de base</a>
            </div>
          </Route> {/* Autre routes */}

        </Switch>
      </div>
    </Router>
  );
}

export default App;