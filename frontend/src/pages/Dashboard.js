import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [handlers, setHandlers] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const githubHandlers = handlers
    .filter(({ handler }) => handler.platform === 'GH')
    .sort((a, b) => (b.data['Github contributions'] || 0) - (a.data['Github contributions'] || 0));

  const leetcodeHandlers = handlers
    .filter(({ handler }) => handler.platform === 'LC')
    .sort((a, b) => (b.data['Leetcode submissions'] || 0) - (a.data['Leetcode submissions'] || 0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const handlersResponse = await api.get('userhandlers/');
        const userHandlers = handlersResponse.data;

        const statsPromises = userHandlers.map(async (handler) => {
          try {
            const response = await api.get('userhandlers/viewhandler/', {
              params: {
                handlerid: handler.handlerid,
                platform: handler.platform === 'LC' ? 'leetcode' : 'github',
                days: 7,
              }
            });
            return { 
              handler, 
              data: response.data,
              label: handler.platform === 'LC' ? 'LeetCode Submissions' : 'GitHub Contributions'
            };
          } catch (err) {
            console.error(`Error fetching stats for handler ${handler.handlerid}:`, err);
            return null;
          }
        });

        const statsResults = (await Promise.all(statsPromises)).filter(result => result !== null);
        
        const githubResults = statsResults
          .filter(result => result.handler.platform === 'GH')
          .sort((a, b) => (b.data['Github contributions'] || 0) - (a.data['Github contributions'] || 0));

        const leetcodeResults = statsResults
          .filter(result => result.handler.platform === 'LC')
          .sort((a, b) => (b.data['Leetcode submissions'] || 0) - (a.data['Leetcode submissions'] || 0));

        const githubData = {
          labels: githubResults.map(result => result.handler.handlername),
          datasets: [{
            label: 'GitHub Contributions',
            data: githubResults.map(result => result.data['Github contributions'] || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderWidth: 1
          }]
        };

        const leetcodeData = {
          labels: leetcodeResults.map(result => result.handler.handlername),
          datasets: [{
            label: 'LeetCode Submissions',
            data: leetcodeResults.map(result => result.data['Leetcode submissions'] || 0),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1
          }]
        };

        setHandlers(statsResults);
        setChartData({ github: githubData, leetcode: leetcodeData });
        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  return (
    <Container>
      <h2 className="my-4">Weekly Coding Activity</h2>
      <p className="lead">Your contributions/submissions in the last 7 days</p>

      <Row className="my-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>GitHub Activity</Card.Title>
              {chartData?.github?.labels?.length > 0 ? (
                <div style={{ height: '400px' }}>
                  <Bar
                    data={chartData.github}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'GitHub Contributions' }
                      }
                    }}
                  />
                </div>
              ) : (
                <Alert variant="info">No GitHub data available</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>LeetCode Activity</Card.Title>
              {chartData?.leetcode?.labels?.length > 0 ? (
                <div style={{ height: '400px' }}>
                  <Bar
                    data={chartData.leetcode}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'LeetCode Submissions' }
                      }
                    }}
                  />
                </div>
              ) : (
                <Alert variant="info">No LeetCode data available</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <h3 className="mb-3">GitHub Contributions</h3>
          {githubHandlers.length > 0 ? (
            <Row xs={1} className="g-3">
              {githubHandlers.map(({ handler, data }) => (
                <Col key={handler.id}>
                  <Card className="h-100 shadow">
                    <Card.Body>
                      <Card.Title className="d-flex align-items-center">
                        <span className="badge bg-secondary me-2">GH</span>
                        {handler.handlername}
                      </Card.Title>
                      <Card.Subtitle className="mb-3 text-muted">
                        {handler.handlerid}
                      </Card.Subtitle>
                      <Card.Text className="display-5 fw-bold mb-1">
                        {data['Github contributions'] || 0}
                      </Card.Text>
                      <Card.Text className="text-muted">GitHub Contributions</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info">No GitHub handlers found</Alert>
          )}
        </Col>

        <Col md={6}>
          <h3 className="mb-3">LeetCode Submissions</h3>
          {leetcodeHandlers.length > 0 ? (
            <Row xs={1} className="g-3">
              {leetcodeHandlers.map(({ handler, data }) => (
                <Col key={handler.id}>
                  <Card className="h-100 shadow">
                    <Card.Body>
                      <Card.Title className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">LC</span>
                        {handler.handlername}
                      </Card.Title>
                      <Card.Subtitle className="mb-3 text-muted">
                        {handler.handlerid}
                      </Card.Subtitle>
                      <Card.Text className="display-5 fw-bold mb-1">
                        {data['Leetcode submissions'] || 0}
                      </Card.Text>
                      <Card.Text className="text-muted">LeetCode Submissions</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info">No LeetCode handlers found</Alert>
          )}
        </Col>
      </Row>

      {handlers.length === 0 && (
        <Alert variant="info" className="mt-4">
          No coding handlers found. Add your LeetCode or GitHub profiles to start tracking!
        </Alert>
      )}
    </Container>
  );
}