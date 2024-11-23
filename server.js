const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

// Endpoint untuk mengambil berita dari Berita Indo API
   app.get('/api/berita', async (req, res) => {
       try {
           const response = await axios.get('https://berita-indo-api.vercel.app/v1/cnn-news');
           res.json(response.data);
       } catch (error) {
           console.error('Error fetching news from Berita Indo API:', error);
           res.status(500).send('Error fetching news');
       }
   });


app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
