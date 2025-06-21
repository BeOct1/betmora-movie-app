const axios = require('axios');

exports.searchMovies = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query,
        },
      }
    );
    res.json({ results: response.data.results });
  } catch (err) {
    res.status(500).json({ message: 'TMDB request failed' });
  }
};
