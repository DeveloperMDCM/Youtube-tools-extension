// routes/index.tsx
import { Routes, Route } from 'react-router-dom';
import { Appearance } from '../pages/Appearance';
import { General } from '../pages/General';
import { Themes } from '../pages/Themes';
import { Settings } from '../pages/Settings';
import { Home } from '../pages/Home';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/general' element={<General />} />
      <Route path='/temas' element={<Themes />} />
      <Route path='/apariencia' element={<Appearance />} />
      <Route path='/configuracion' element={<Settings />} />
    </Routes>
  );
};
