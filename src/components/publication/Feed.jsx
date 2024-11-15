import { PublicationList } from "./PublicationList"

export const Feed = () => {
  return (
    <>
      <header className="content__header">
          <h1 className="content__title">Timeline</h1>
          <button className="content__button" >Mostrar nuevas</button>
      </header>

      <PublicationList
          publications={''}
          getPublications={''}
          page={''}
          setPage={''}
          more={''}
          setMore={''}
          isProfile={''} // No es un perfil, es el feed
      />
      <br />
    </>
  )
}