import { Link } from "react-router-dom";

function Accueil() {
    return(
     <>
      <main className="accueil">
        <section>
            <h1 className="titrePageAccueil">bienvenue sur le site de l'asi course pedestre</h1>
            <div className="container">
                <div className="row col-md-12">
                    <div className="imageAccueil">
                        <Link to={"/savoir"} className="btnPlusAccueil" href="#">En savoir +</Link>
                    </div>
                </div>
            </div>
        </section>
        <section className="container-fluid grilleAccueil">
            <div className="container">
                <div className="row col-md-12">
                    <div className="wrapperAccueil">
                            <img className="contGrille1Accueil imgAccueil" src="/img/FB_IMG_1665583425942.jpg" alt="ambiance"/>
                        
                        <article className="textAccueil contGrille2Accueil">
                            <h2>Motivation, Bonne ambiance, Entraide.</h2>
                            <p>Pas envie de courir seul, baisse de motivation!!</p>
                            <p>Venez rejoindre un groupe de coureurs motivés, ambiancés, qui saura vous redonner l'envie de courir, progresser, où il y a toujours quelqu'un pour vous accompagner, vous tirer, vous encourager dans la bonne humeur.</p>
                        </article>
                        <article className="textAccueil contGrille3Accueil">
                            <h2>Des entraînements motivants, variés, supervisés.</h2>
                            <p>Nos entraînements sont dispensés à des horaires fixes, sur des lieux définis, par des entraineurs bénévoles, toujours dans la bonne humeur et le respect de chacun. Ils sont adaptés dans la mesure du possible aux attentes et ambitions de chacun.</p>
                        </article>
                        <img className="contGrille4Accueil imgAccueil" src="/img/FB_IMG_1665584768238.jpg" alt="entrainements"/>
                        <img className="contGrille5Accueil imgAccueil" src="/img/FB_IMG_1665583114508.jpg" alt="challenges"/>
                        <article className="textAccueil contGrille6Accueil">
                            <h2>Challenges, courses suivis par le club.</h2>
                            <p>De nombreux coureurs du club, participent à des courses ou challenges, souvent dans le département, afin de garder une grande motivation et s'améliorer. Mais ils participent aussi à de nombreuses courses hors du département, allant même aux quatres coins de l'hexagone, mais aussi à l'étranger, afin de découvrir de nouveaux et magnifiques paysages, ou de se challenger davantage.</p>
                        </article>
                        <article className="textAccueil contGrille7Accueil">
                            <h2>Le club c'est le sport mais pas que!!!</h2>
                            <p>Les entraînements, les courses c'est bien, mais il faut aussi savoir décompresser et resserrer les liens entre chacun. Pour cela, le club organise des soirées et sorties extra sportives en famille.
                                On ne refuse jamais non plus un petit apéritif, petit-déjeuner après les entraînements afin de fêter anniversaires ou autres évènements!</p>
                        </article>
                        <img className="contGrille8Accueil imgAccueil" src="/img/FB_IMG_1665583242135.jpg" alt="fete"/>
                    </div>
                </div>
            </div>
        </section>
    </main>
    
    </>
  );
}

export default Accueil;