
const Footer = () => {
  return (
    <h1 className="flex text-center items-center justify-center text-slate-300 font-light pb-2">
      &nbsp;<span className="text-amber-300">&copy;</span>&nbsp; Copyright{" "}
      {new Date().getFullYear()} Created By: Herb Segismar
    </h1>
  );
}

export default Footer