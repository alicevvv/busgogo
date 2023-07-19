import './App.css';
import { StoreProvider } from "./store/index";
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from './page/Home';
import News from './page/News';
import Path from './page/Path';
import './custom.css'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/news' element={<News/>}></Route>
          <Route path='/bus/:routeName' element={<Path/>}></Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
