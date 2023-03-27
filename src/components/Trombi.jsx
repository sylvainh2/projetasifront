const Trombi = ({trombiD, serverBack})=>{
    return(
        <>
            <div className="trombi">
                {trombiD.map((oneUser)=>{
                    return(
                        <div className="trombiImg" key={oneUser.id}>
                            <img className="trombiPic" src={serverBack+"/profiles/"+oneUser.profil_picture}/>
                            <p>{oneUser.name}</p>
                            <p>{oneUser.first_name}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
export default Trombi;