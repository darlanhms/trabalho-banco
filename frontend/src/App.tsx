import React from 'react'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Row, Col } from 'react-bootstrap'
import './App.css'
import Sidebar from './Components/Sidebar'
import Clientes from './Views/Clientes'
import Cargas from './Views/Cargas'

const App:React.FC = () => {
  return (
    <Router history={createBrowserHistory()}>
      <Row className="main">
        <Col md={2}>
          <Sidebar />
        </Col>
        <Col md={10}>
          <Switch>
            <Route path="/clientes" component={Clientes} />
            <Route path="/cargas" component={Cargas} />
            <Redirect from="/" to="/cargas" />
          </Switch>
        </Col>
      </Row>
    </Router>
  )
}

export default App
