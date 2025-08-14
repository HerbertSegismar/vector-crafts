export default function Circle({
  className = "w-6 h-6",
  fill = "currentColor",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill={fill}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
