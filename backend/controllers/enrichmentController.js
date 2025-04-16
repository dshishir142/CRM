const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const apikey = '38fbcf26532f32839f6a02a6fbf43f8e18cdd5a7';

exports.emailLookup = async (req, res) => {
    const { email } = req.query;
  
    try {
      const response = await fetch(`https://api.hunter.io/v2/people/find?email=${email}&api_key=${apikey}`);
      const data = await response.json();
  
      if (data.data) {
        const result = {
          status: 'success',
          profile: {
            name: data.data.name ? `${data.data.name.givenName} ${data.data.name.familyName}` : 'N/A',
            email: data.data.email,
            location: data.data.location || 'N/A',
            jobTitle: data.data.employment ? data.data.employment.title : 'N/A',
            company: data.data.employment ? data.data.employment.name : 'N/A',
            twitter: data.data.twitter ? data.data.twitter.handle : 'N/A',
            linkedin: data.data.linkedin ? data.data.linkedin.handle : 'N/A',
          }
        };
        res.json(result);
        console.log(result);
      } else {
        res.json({ status: 'error', message: 'No data found for this email.' });
      }
    } catch (error) {
      console.error('Error fetching email data:', error);
      res.json({ status: 'error', message: 'An error occurred while fetching data.' });
    }
  };
  
  

  exports.domainLookup = async (req, res) => {
    const { domain } = req.query;
  
    try {
      const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apikey}`);
      const data = await response.json();
  
      if (data.data && data.data.emails) {
        const result = {
          status: 'success',
          emails: data.data.emails || []
        };
        res.json(result);
      } else {
        res.json({ status: 'error', message: 'No emails found for this domain.' });
      }
    } catch (error) {
      console.error('Error fetching domain data:', error);
      res.json({ status: 'error', message: 'An error occurred while fetching data.' });
    }
  };
  

  exports.verifyEmail = async (req, res) => {
    const { email } = req.query;
  
    try {
      const response = await fetch(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apikey}`);
      const data = await response.json();
  
      if (data.data) {
        const result = {
          status: 'success',
          email: data.data.email,
          verificationStatus: data.data.status || 'unknown',
          valid: data.data.result === 'deliverable'
        };
        res.json(result);
      } else {
        res.json({ status: 'error', message: 'Invalid email verification data.' });
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      res.json({ status: 'error', message: 'An error occurred while verifying the email.' });
    }
  };
  