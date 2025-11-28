import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get('/problems');
        setProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading problems...</div>;

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Problems</h2>
      <div className="problem-list">
        <div className="problem-header" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '1rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
          <div>Title</div>
          <div>Difficulty</div>
          <div>Action</div>
        </div>
        {problems.map(problem => (
          <div key={problem._id} className="problem-item" style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '1rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
            <Link to={`/problems/${problem.slug}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>
              {problem.title}
            </Link>
            <span style={{ 
              color: problem.difficulty === 'Easy' ? '#00b8a3' : problem.difficulty === 'Medium' ? '#ffc01e' : '#ff375f',
              fontWeight: '500'
            }}>
              {problem.difficulty}
            </span>
            <Link to={`/problems/${problem.slug}`} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
              Solve
            </Link>
          </div>
        ))}
        {problems.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No problems found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemList;
