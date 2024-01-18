
import { setLocale, getMessage } from '../i18n';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelectLanguage: (code: string) => void;
  onClose: () => void;
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelectLanguage, onClose }) => {
  const changeLanguage = (code: string) => {
    onSelectLanguage(code);
    setLocale(code);
    onClose();
  };

  return (
    <div className="absolute top-1/2 h-[200px] overflow-y-auto w-[450px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white  rounded-md shadow-lg">
      <div className="flex justify-end mb-2 h-10 sticky -top-1 bg-sky-600 shadow-md ">
        <button className="text-white mx-3 w-full" onClick={onClose}>
          <div className='flex items-center'>
        <span className='text-center w-full font-bold'>{getMessage('lan')}</span> 
        <i className="fa-solid fa-xmark text-2xl hover:text-red-700"></i>

          </div>
        </button>
      </div>
      <div className="space-y-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`${
              selectedLanguage === lang.code ? 'bg-red-600 text-white font-bold text-center' : 'text-gray-500 text-center'
            } block w-full px-4 py-2 text-sm  hover:bg-sky-500 hover:text-white shadow-2xl shadow-gray-800`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
