import React, { useState } from 'react';
import 'firebase/storage';
import { Navbar, Nav, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from 'react-router-dom';

export default function NavigationBar() {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      await localStorage.clear();
      history.push('/login');
    } catch {
      setError('Failed to log out');
    }
  }
  return (
    <>
      <Navbar style={{ backgroundColor: '#290AA0' }}>
        <Navbar.Brand
          href="#"
          style={{
            color: '#9d96ff',
            fontSize: '20px',
            marginTop: '0px',
            marginBottom: '5px',
          }}
        >
          <img src="/logo.png" height="50px"></img>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link
            href="/"
            style={{
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 'bold',
              fontFamily: 'open sans-serif',
              marginRight: '20px',
            }}
          >
            Home
          </Nav.Link>

          {currentUser && (
            <>
              <Nav.Link
                href="/dashboard"
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                Search
              </Nav.Link>
              {/* <Nav.Link href="/JdResult" style={{ color: "#ffffff",fontSize:"17px",fontFamily:" sans-serif",marginRight:"20px" }}>
             Result
              </Nav.Link> */}
              <Nav.Link
                href="/shortlist"
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                Shortlisted
              </Nav.Link>
              <Nav.Link
                href="/JdHistory"
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                History
              </Nav.Link>
            </>
          )}
          <Nav.Link
            href="/Insights"
            style={{
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 'bold',
              fontFamily: 'open sans-serif',
              marginRight: '20px',
            }}
          >
            Insights
          </Nav.Link>
        </Nav>

        <Nav className="ml-auto">
          {currentUser ? (
            <>
              <Nav.Link
                href="/update-profile"
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                Update Profile
              </Nav.Link>
              <Nav.Link
                href="#"
                onClick={handleLogout}
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                href="/login"
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="/register"
                style={{
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: 'bold',
                  fontFamily: 'open sans-serif',
                  marginRight: '20px',
                }}
              >
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar>

      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
}
