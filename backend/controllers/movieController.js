
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

exports.searchMovies = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'TMDB API error', error: err.message });
  }
};
