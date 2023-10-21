const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8081;

app.get('/', async (req, res) => {
  const username = req.query.username || 'myogeshchavan97';
  try {
    const reply = {
      hello :  'world'
    }
    
    res.send(reply);
  } catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.get('/test-new-endpoint', async (req, res) => {
  const username = req.query.username || 'myogeshchavan97';
  try {
    const reply = {
      message :  'great success'
    }
    
    res.send(reply);
  } catch (error) {
    res.status(400).send('Error while getting list of repositories');
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
