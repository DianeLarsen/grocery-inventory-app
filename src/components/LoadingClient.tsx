// app/loading/LoadingClient.tsx
const LoadingClient = () => {
 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
      </div>


        <p className="mt-3 text-lg text-green-400 animate-fade-in">
          🚀 Loading your experience...
        </p>


      <div className="mt-6 flex items-center gap-2 text-lg opacity-80">
        <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
        <span>Just a moment...</span>
      </div>
    </div>
  );
};

export default LoadingClient;
