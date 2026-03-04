const Loading = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loading;
