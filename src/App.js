import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


// Components
import NavBar from './components/NavBar';
import MembersList from './components/MemberList';
import MemberForm from './components/MemberForm';
import MemberDetails from './components/MemberDetails';
import Home from './components/Home';
import Help from './components/Help';


function App() {
  return (
    <Router>
      <div className="App">
        <NavBar fixed="top" />
      <div style={{ height: '32px' }} /> {/* spacer for navbar height */}
        <NavBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/members/add" element={<MemberForm />} />
            <Route path="/members/edit/:id" element={<MemberForm />} />
            <Route path="/members/:id" element={<MemberDetails />} />
            <Route path="/help" element={<Help />} />
            

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
