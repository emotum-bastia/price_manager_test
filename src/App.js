import './App.css';

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'; // Importez BrowserRouter, Route et Switch
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';

import FileViewer from './pages/MainPage';
import Graphique from './pages/Graphique'; // Importez votre composant GraphPage
import Load from './pages/Load';
import { db } from "./functions/dbConnection"

function App() {



  return (
    <Router>
      <div className="App">

        <Switch>
          <Route path="/" exact component={Load} /> {/* Route pour MainPage */}
          <Route path="/graph" component={Graphique} /> {/* Route pour GraphPage */}
          <Route path="/Load" component={FileViewer} /> {/* Route pour Load */}
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