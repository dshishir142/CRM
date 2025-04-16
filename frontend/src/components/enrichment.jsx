import React, { useState } from 'react';
import style from '../style/enrichment.module.css';

const Enrichment = () => {
  const [searchType, setSearchType] = useState('email');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    let endpoint = '';
    let paramKey = '';

    switch (searchType) {
      case 'email':
        endpoint = '/enrich';
        paramKey = 'email';
        break;
      case 'domain':
        endpoint = '/enrich/domain';
        paramKey = 'domain';
        break;
      case 'verify':
        endpoint = '/enrich/verify';
        paramKey = 'email';
        break;
      default:
        return;
    }

    try {
      const res = await fetch(`http://localhost:8000${endpoint}?${paramKey}=${inputValue}`);
      const data = await res.json();
      
      if (data.status === 'success') {
        setResult(data);
        setError('');
      } else {
        setError(data.message || 'No data found.');
      }
    } catch (err) {
      setResult(null);
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    }
  };

  const getInstruction = () => {
    switch (searchType) {
      case 'email':
        return 'Search for someone’s public profile using their email (e.g., social links, name, job).';
      case 'domain':
        return 'Get a list of public emails associated with a company domain (e.g., example.com).';
      case 'verify':
        return 'Check if an email is valid and currently reachable.';
      default:
        return '';
    }
  };

  const renderResults = () => {
    if (!result) return null;

    switch (searchType) {
      case 'email':
        return (
          result.profile && (
            <div className={style.resultBox}>
              <h3>Profile Information</h3>
              <p><strong>Name:</strong> {result.profile.name}</p>
              <p><strong>Email:</strong> {result.profile.email}</p>
              <p><strong>Location:</strong> {result.profile.location}</p>
              <p><strong>Job Title:</strong> {result.profile.jobTitle}</p>
              <p><strong>Company:</strong> {result.profile.company}</p>
              <p><strong>Twitter:</strong> {result.profile.twitter}</p>
              <p><strong>LinkedIn:</strong> {result.profile.linkedin}</p>
            </div>
          )
        );
        
      case 'domain':
        return (
          result.emails && (
            <div className={style.resultBox}>
              <h3>Emails Found in Domain</h3>
              {result.emails.length > 0 ? (
                <ul>
                  {result.emails.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
              ) : (
                <p>No emails found for this domain.</p>
              )}
            </div>
          )
        );
        
      case 'verify':
        return (
          result.email && (
            <div className={style.resultBox}>
              <h3>Email Verification Result</h3>
              <p><strong>Email:</strong> {result.email}</p>
              <p><strong>Status:</strong> {result.verificationStatus}</p>
              <p><strong>Valid:</strong> {result.valid ? 'Yes' : 'No'}</p>
            </div>
          )
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={style.enrichment_container}>
      <h2 className={style.title}>Data Enrichment</h2>

      <form className={style.enrichment_form} onSubmit={handleSearch}>
        <label htmlFor="searchType">Search Type:</label>
        <select
          id="searchType"
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            setInputValue('');
            setResult(null);
            setError('');
          }}
        >
          <option value="email">Search Profile with Email</option>
          <option value="domain">Search Domain for Emails</option>
          <option value="verify">Verify Email Validity</option>
        </select>

        <p className={style.instruction}>{getInstruction()}</p>

        <input
          type="text"
          placeholder={
            searchType === 'domain'
              ? 'Enter domain (e.g., example.com)'
              : 'Enter email address'
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      {error && <p className={style.error}>{error}</p>}

      {renderResults()}
    </div>
  );
};

export default Enrichment;
