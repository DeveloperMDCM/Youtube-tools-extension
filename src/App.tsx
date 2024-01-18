import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { LayoutBody } from "./components/LayoutBody";
import "@fortawesome/fontawesome-free/css/all.min.css";
export const App = () => {
  return (
    <>
      <main>
        <BrowserRouter>
          <Nav />
          <LayoutBody>
            <AppRoutes />
          </LayoutBody>
          <Footer />
        </BrowserRouter>
      </main>
    </>
  );
};
