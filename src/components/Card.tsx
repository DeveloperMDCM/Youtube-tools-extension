interface Card {
  title: string;
  description: string;
  info: string;
  children: React.ReactNode;
}
export const Card = ({ title, description, info, children }: Card) => {
  return (
    <div className="w-full p-3 mb-5 shadow bg-gray-800 rounded-md">
      <h5 className="mb-2 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
        {title}
      </h5>
      <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {children}
      <div className="text-white text-sm">
        <i className="fa-solid fa-circle-info mr-2"></i>
        {info}
      </div>
    </div>
  );
};
