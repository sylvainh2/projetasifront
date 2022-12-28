import '../src/assets/scss/style.scss';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import PicturesShow from './pages/PicturesShow';
import LoginShow from './pages/LoginShow';
import SavoirShow from './pages/SavoirShow';
import SignupShow from './pages/SignupShow';
import CgShow from './pages/CgShow';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/photos" element={<PicturesShow />}/>
          <Route path="/login" element={<LoginShow />}/>
          <Route path="/savoir" element={<SavoirShow />}/>
          <Route path="/signup" element={<SignupShow />}/>
          <Route path="cg" element={<CgShow />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
