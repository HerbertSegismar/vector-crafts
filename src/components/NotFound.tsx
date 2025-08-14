import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-amber-300 text-2xl font-bold">
      <h1 className="my-4 capitalize drop-shadow-xl drop-shadow-black">This page is not available</h1>
      <button
        onClick={() => navigate("/")}
        className="w-36 h-12 mx-4 cursor-pointer text-xl bg-amber-50/40 rounded-lg text-slate-900 hover:bg-amber-50/60 transition-colors"
      >
        Return Home
      </button>
    </div>
  );
};

export default NotFound;