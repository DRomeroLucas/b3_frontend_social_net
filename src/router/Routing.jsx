import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "../components/layouts/public/PublicLayout";
import { PrivateLayout } from "../components/layouts/private/PrivateLayout";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { Feed } from "../components/publication/Feed";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";
import { Error404 } from "../components/layouts/Error404";
import { AuthProvider } from "../context/AuthProvider";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Cargamos los omponentes de la ruta publica */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
          </Route>
          {/* Cargamos los omponentes de la ruta privada */}
          <Route path="/rsocial/" element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="gente" element={<People />} />
            <Route path="ajustes" element={<Config />} />
          </Route>

          <Route path="*" element={<Error404 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
