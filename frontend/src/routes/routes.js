import MediaSearch from "../pages/MediaSearch";
import MovieDetails from "../pages/MovieDetails";
import FavoriteList from "../pages/FavoriteList";
import Watchlist from "../pages/Watchlist";
import Recommendations from "../pages/Recommendations";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Splash from "../pages/Splash";
import About from "../pages/About";

const routes = [
  { index: true, element: <MediaSearch />, state: "search" },
  { path: "splash", element: <Splash />, state: "splash" },
  { path: "about", element: <About />, state: "about" },
  { path: "movie/:id", element: <MovieDetails />, state: "movieDetails" },
  { path: "favorites", element: <FavoriteList />, state: "favorites" },
  { path: "watchlist", element: <Watchlist />, state: "watchlist" },
  { path: "recommendations", element: <Recommendations />, state: "recommendations" },
  { path: "profile", element: <Profile />, state: "profile" },
  { path: "login", element: <Login />, state: "login" },
  { path: "register", element: <Register />, state: "register" }
];

export default routes;
