import SearchPage from '../pages/search.jsx';
import BrowsePage from '../pages/browse.jsx';
import FavoritesPage from '../pages/favorites.jsx';
import ShowsPage from '../pages/shows.jsx';
import LivePage from '../pages/live.jsx';

const routes = [
  {
    path: '/',
    redirect: '/shows/',
  },
  {
    path: '/shows/',
    component: ShowsPage,
  },
  {
    path: '/search/',
    component: SearchPage,
  },
  {
    path: '/browse/',
    component: BrowsePage,
  },
  {
    path: '/favorites/',
    component: FavoritesPage,
  },
  {
    path: '/live/',
    component: LivePage,
  },
];

export default routes;
