import { useState } from 'react';
import { useEffect } from 'react';
import avatar from '../../assets/img/default.png';
import { GetProfile } from '../../helpers/GetProfile';
import { useParams } from "react-router-dom";
import { Global } from '../../helpers/Global';
import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Profile = () => {

    const { auth, counters, setCounters } = useAuth();
    const [user, setUser] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const params = useParams();

    useEffect(() => {
        getDataUser();
        getCounters();
        getPublications(1, true);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounters();
        setMore(true);
        getPublications(1, true);
    }, [params])

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.userId, setUser);

        if (dataUser.following && dataUser.following._id) setIFollow(true);
    }

    const getCounters = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.following) {
            setCounters(data);
        }

    }

    const follow = async (userId) => {
        // peticion al backend para guardar el follow
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        // Cuando este todo correcto
        if (data.status == "success") {
            setIFollow(true);
            // Actualiza los contadores
            getCounters();
        }
    };

    const unfollow = async (userId) => {
        // peticion al backend para borrar el follow
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        // Cuando este todo correcto
        if (data.status == "success") {
            setIFollow(false);
            // Actualiza los contadores
            getCounters();
        }
    }

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(Global.url + "publication/user/" + params.userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status == "success") {

            let newPublications = data.publications;

            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            if(newProfile){
                newPublications = data.publications;
                setMore(true);
                setPage(1);
            }

            setPublications(newPublications);

            if (!newProfile && publications.length >= (data.total - data.publications.length)) {
                setMore(false);
            }

            if(data.pages <= 1){
                setMore(false);
            }
        }
    }



    return (
        <>
            <header className="aside__profile-info">

                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image != "default.png" && (
                            <img src={user.image} className="container-avatar__img" alt="Foto de perfil" />
                        )}
                        {user.image == "default.png" && (
                            <img src={avatar} className="container-avatar__img" alt="Foto de perfil" />
                        )}
                    </div>

                    <div className="general-info__container-names">
                        <div className="container-names__name">
                            <h1>{user.name} {user.surname}</h1>

                            {user._id != auth._id &&
                                (iFollow ?
                                    <button onClick={() => unfollow(user._id)} className="content__button content__button--rigth post__button">Dejar de seguir</button>
                                    :
                                    <button onClick={() => follow(user._id)} className="content__button content__button--rigth">Seguir</button>
                                )
                            }
                        </div>
                        <h2 className="container-names__nickname">{user.nick}</h2>
                        <p>{user.bio}</p>

                    </div>

                </div>

                <div className="profile-info__stats">

                    <div className="stats__following">
                        <Link to={"/rsocial/siguiendo/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counters.followingCount >= 1 ? counters.followingCount : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/rsocial/seguidores/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counters.followedCount >= 1 ? counters.followedCount : 0}</span>
                        </Link>
                    </div>


                    <div className="stats__following">
                        <Link to={"/rsocial/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counters.publicationsCount >= 1 ? counters.publicationsCount : 0}</span>
                        </Link>
                    </div>


                </div>
            </header>

            <PublicationList
                publications={publications}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                isProfile={true}
            />
            <br />
        </>
    )
}