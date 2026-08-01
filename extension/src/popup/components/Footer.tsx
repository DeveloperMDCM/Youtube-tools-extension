export function Footer() {
  return (
    <footer className="relative z-0 bg-blue-500 py-2 font-bold transition-all duration-500 hover:bg-red-500">
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/DeveloperMDCM"
        className="flex w-full items-center justify-center text-center"
      >
        <h2 className="text-white">Source Code</h2>
        <i className="fa-brands fa-github mx-2 text-3xl text-white" />
        <h2 className="text-white">DeveloperMDCM</h2>
      </a>
    </footer>
  );
}
