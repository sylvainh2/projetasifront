import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";


function Header() {

  let disableNav = 'disabled'

  const roleData = window.localStorage.getItem("jwt");

  if (roleData) {
    const role = (jwt_decode(roleData)).roles;


    if(role==="admin" || role==="user"){
      disableNav = "";
     } 
  }


  
    return (
        <>
        <header>
          <nav className="navbar navbar-expand-lg bg-light">
              <div className="container-fluid navbar_image">
                <Link to={"/"} className="navbar-brand" href="#">
                  <img src="/img/ASI-logo-01b.png" alt="logo"/>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav w-100 justify-content-lg-around">
                    <li className="nav-item ms-lg-auto ">
                      <Link to={"/photos"} className={"nav-link "+disableNav} aria-current="page">Galerie</Link>
                    </li>
                    <li className="nav-item ms-lg-auto ">
                      <a className={"nav-link "+disableNav} href="#">Actualités</a>
                    </li>
                    <li className="nav-item ms-lg-auto ">
                      <a className={"nav-link "+disableNav} href="#">Evenements</a>
                    </li>
                    <li className="nav-item ms-lg-auto ">
                      <Link to={"/users"} className={"nav-link "+disableNav} href="#">Adhérents</Link>
                    </li>
                    <li className="nav-item ms-lg-auto ">
                      <Link to={"/login"} className="text-center nav-link" >connexion<span><i className="fa-regular fa-user"></i></span></Link>
                    </li>
                    <li className="nav-item">
                      <Link to={"/signup"} className="text-center nav-link" >s'inscrire<span><i className="fa-solid fa-pencil"></i></span></Link>
                    </li>
                  </ul> 
                </div>
              </div>
            </nav>
        </header>
    </>
    );
}

export default Header;