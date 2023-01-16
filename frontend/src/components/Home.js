import React from 'react';
import { Button } from '@material-ui/core';
import { Row, Col } from 'react-bootstrap';
import './Home.css';

export default function Home() {
  return (
    <div
      className="align-items-center justify-content-center mHome"
      style={{
        backgroundImage: 'url(objects.png)',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
      }}
    >
      <div className="contain">
        <Row>
          <Col>
            <div className="home">
              <div className="mainHome">
                <div className="hTitle">
                  <p className="hTitleContent"> HIREQ-2023</p>
                </div>
                <div className="hDiscription">
                  <p className="hDisContent">
                    {' '}
                    Search Engine To Make Hiring Hustle Free{' '}
                  </p>
                </div>
                <div className="hButton">
                  <Button className="sButton" variant="contained">
                    Find Candidates
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
