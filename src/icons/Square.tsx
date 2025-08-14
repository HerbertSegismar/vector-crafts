export default function Square({
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
      <rect x="4" y="4" width="16" height="16" rx="1" />
    </svg>
  );
}
