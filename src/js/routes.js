import SearchPage from '../pages/search.jsx';
import BrowsePage from '../pages/browse.jsx';
import SettingsPage from '../pages/settings.jsx';

const routes = [
  {
    path: '/',
    redirect: '/search/',
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
    path: '/settings/',
    component: SettingsPage,
  },
];

export default routes;
