import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import About from './pages/About';

function App() {
  
  return (
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/tasks' element={<Tasks />} />
      <Route path="/about" element={<About />} />
    </Routes>
   
    <Footer/>
  </BrowserRouter>  
  );
}

export default App;
