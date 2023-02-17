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
import UserShow from './pages/UserShow';
import PartShow from './pages/PartShow';


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
          <Route path="/cg" element={<CgShow />}/>
          <Route path="/users" element={<UserShow />}/>
          <Route path="/partenaires" element={<PartShow />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
