import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const ProblemSolve = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [languageId, setLanguageId] = useState(71); // Default Python 3.8.1
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/problems/${slug}`);
        setProblem(response.data);
        // Set default starter code based on language (simplified)
        setCode(`# Write your solution for ${response.data.title} here\n\n`);
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null);
    try {
      const response = await api.post('/submissions', {
        problemId: problem._id,
        code,
        languageId
      });
      setOutput(response.data);
    } catch (error) {
      console.error('Submission error:', error);
      setOutput({ status: 'Error', errorMessage: 'Failed to submit code.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setRunOutput(null);
    try {
      const response = await api.post('/runner/run', {
        code,
        languageId,
        customInput
      });
      setRunOutput(response.data);
    } catch (error) {
      console.error('Run error:', error);
      setRunOutput({ 
        status: 'Error', 
        stderr: error.response?.data?.message || 'Failed to run code.' 
      });
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="solve-container" style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      {/* Left Panel: Description */}
      <div className="left-panel" style={{ flex: 1, padding: '2rem', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
        <h1 style={{ marginBottom: '1rem' }}>{problem.title}</h1>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ 
            padding: '0.2rem 0.5rem', 
            borderRadius: '4px', 
            background: 'rgba(255,255,255,0.1)',
            color: problem.difficulty === 'Easy' ? '#00b8a3' : problem.difficulty === 'Medium' ? '#ffc01e' : '#ff375f'
          }}>
            {problem.difficulty}
          </span>
        </div>
        <div className="description" style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          {problem.description}
        </div>
        
        {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Example 1:</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
              <div><strong>Input:</strong> {problem.sampleTestCases[0].input}</div>
              <div><strong>Output:</strong> {problem.sampleTestCases[0].output}</div>
              {problem.sampleTestCases[0].explanation && <div><strong>Explanation:</strong> {problem.sampleTestCases[0].explanation}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Editor */}
      <div className="right-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="editor-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <select 
            value={languageId} 
            onChange={(e) => setLanguageId(Number(e.target.value))}
            style={{ padding: '0.5rem', background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}
          >
            <option value={71}>Python (3.8.1)</option>
            <option value={63}>JavaScript (Node.js 12.14.0)</option>
            <option value={54}>C++ (GCC 9.2.0)</option>
            <option value={62}>Java (OpenJDK 13.0.1)</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleRun} 
              disabled={running}
              className="btn"
              style={{ 
                padding: '0.5rem 1rem', 
                background: 'rgba(255,255,255,0.1)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '4px',
                cursor: running ? 'not-allowed' : 'pointer',
                opacity: running ? 0.6 : 1
              }}
            >
              {running ? 'Running...' : 'Run'}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ 
            flex: 1, 
            width: '100%', 
            background: '#1e1e1e', 
            color: '#d4d4d4', 
            border: 'none', 
            padding: '1rem', 
            fontFamily: 'monospace', 
            fontSize: '14px', 
            resize: 'none',
            outline: 'none'
          }}
          spellCheck="false"
        />

        {/* Custom Input and Output Console */}
        <div style={{ height: '250px', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-color)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: '#0f0f0f' }}>
            <div style={{ padding: '0.5rem 1rem', borderRight: '1px solid var(--border-color)', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              Custom Input
            </div>
          </div>
          
          {/* Custom Input Area */}
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter custom input here (e.g., [2,7,11,15], 9)"
            style={{ 
              flex: 1,
              width: '100%', 
              background: '#0f0f0f', 
              color: '#d4d4d4', 
              border: 'none', 
              padding: '1rem', 
              fontFamily: 'monospace', 
              fontSize: '13px', 
              resize: 'none',
              outline: 'none'
            }}
            spellCheck="false"
          />
          
          {/* Output Display */}
          {(runOutput || output) && (
            <div className="output-console" style={{ maxHeight: '200px', background: '#0a0a0a', borderTop: '1px solid var(--border-color)', padding: '1rem', overflowY: 'auto' }}>
              {runOutput && (
                <div style={{ marginBottom: output ? '1rem' : '0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#00b8a3', fontSize: '0.9rem' }}>Run Output:</h4>
                  {runOutput.statusId === 3 ? (
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#00b8a3', marginBottom: '0.3rem' }}>✓ Success</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div>Time: {runOutput.time}s | Memory: {runOutput.memory}KB</div>
                      </div>
                      {runOutput.stdout && (
                        <pre style={{ marginTop: '0.5rem', color: '#d4d4d4', whiteSpace: 'pre-wrap', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '4px' }}>
                          {runOutput.stdout}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#ff375f', marginBottom: '0.3rem' }}>✗ {runOutput.status}</div>
                      {runOutput.stderr && (
                        <pre style={{ color: '#ff375f', whiteSpace: 'pre-wrap', fontSize: '0.85rem', background: 'rgba(255,55,95,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                          {runOutput.stderr}
                        </pre>
                      )}
                      {runOutput.compileOutput && (
                        <pre style={{ color: '#ffc01e', whiteSpace: 'pre-wrap', fontSize: '0.85rem', background: 'rgba(255,192,30,0.1)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.3rem' }}>
                          {runOutput.compileOutput}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {output && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: output.status === 'Accepted' ? '#00b8a3' : '#ff375f', fontSize: '0.9rem' }}>
                    Submission Result:
                  </h4>
                  {output.status === 'Accepted' ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ color: '#00b8a3', marginBottom: '0.3rem' }}>✓ {output.status}</div>
                      <div>Runtime: {output.runtime}s</div>
                      <div>Memory: {output.memory}KB</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#ff375f', marginBottom: '0.3rem' }}>✗ {output.status}</div>
                      <pre style={{ color: '#ff375f', whiteSpace: 'pre-wrap', fontSize: '0.85rem', background: 'rgba(255,55,95,0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                        {output.errorMessage}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSolve;
