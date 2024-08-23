import ReactDOM from 'react-dom/client';
import RouterProvider from './Router/RouterContext';
import Router from './Router/Router';
import './Style/main.css'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <RouterProvider>
    <Router></Router>
  </RouterProvider>
  </>
);
