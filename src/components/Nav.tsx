// Nav.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import LanguageSelector from "./LanguageSelector";
import { getMessage } from "../i18n";
export const Nav: React.FC = () => {
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
  };
  return (
    <>
      <header className="flex justify-row sticky p-0 z-10">
        <div className="text-end relative z-10">
          {showLanguageSelector && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-60 flex items-center justify-center">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleSelectLanguage}
                onClose={() => setShowLanguageSelector(false)}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center bg-black text-white">
          <div className="w-full flex justify-between p-3 items-center">
            <h1 className="font-bold py-1 text-center w-full">
              Youtube Tools Extensión
            </h1>
            <div className="flex gap-2 items-center absolute justify-end w-full -mx-6">
              <Link
                to={"/"}
                className="text-white text-2xl  hover:text-red-600"
              >
                <i className="fa-solid fa-house"></i>
              </Link>
              <button
                className="text-white text-3xl  hover:text-red-600"
                onClick={() => setShowLanguageSelector(true)}
              >
                <i className="fa-solid fa-globe"></i>
              </button>
            </div>
          </div>

          <nav>
            <ul className="flex justify-center gap-2 p-3 pt-0">
              <li>
                <Link
                  to={"general"}
                  className={` ${
                    location.pathname === "/general"
                      ? "bg-sky-500 hover:bg-sky-700"
                      : ""
                  }
        w-[140px] max-w-[130px] p-5 flex flex-col rounded-md transition-all bg-red-600  hover:bg-sky-500
        `}
                >
                  <i
                    className={` ${
                      location.pathname === "/general"
                        ? "fa-solid fa-folder-open animate-bounce"
                        : "fa-regular fa-folder"
                    }
                  text-3xl text-center
            `}
                  ></i>
                  <span className="text-center">{getMessage("general")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/temas"}
                  className={` ${
                    location.pathname === "/temas"
                      ? "bg-sky-500 hover:bg-sky-700"
                      : ""
                  }
        w-[140px] max-w-[130px] p-5 flex flex-col rounded-md transition-all bg-red-600  hover:bg-sky-500
        `}
                >
                  <i
                    className={` ${
                      location.pathname === "/temas"
                        ? "fa-solid fa-fill-drip animate-bounce"
                        : "fa-solid fa-fill"
                    }
                  text-3xl text-center
            `}
                  ></i>
                  <span className="text-center">{getMessage("themes")}</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"apariencia"}
                  className={` ${
                    location.pathname === "/apariencia"
                      ? "bg-sky-500 hover:bg-sky-700"
                      : ""
                  }
        w-[140px] max-w-[130px] p-5 flex flex-col rounded-md transition-all bg-red-600  hover:bg-sky-500
        `}
                >
                  <i
                    className={` ${
                      location.pathname === "/apariencia"
                        ? "fa-solid fa-desktop animate-bounce"
                        : "fa-solid fa-display"
                    }
                  text-3xl text-center
            `}
                  ></i>
                  <span className="text-center">
                    {getMessage("appearance")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={"configuracion"}
                  className={` ${
                    location.pathname === "/configuracion"
                      ? "bg-sky-500 hover:bg-sky-700"
                      : ""
                  }
        w-[140px] max-w-[130px] p-5 flex flex-col rounded-md transition-all bg-red-600  hover:bg-sky-500
        `}
                >
                  <i
                    className={` ${
                      location.pathname === "/configuracion"
                        ? "fa-solid fa-screwdriver-wrench animate-bounce"
                        : "fa-solid fa-wrench"
                    }
                  text-3xl text-center
            `}
                  ></i>
                  <span className="text-center">{getMessage("setting")}</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
