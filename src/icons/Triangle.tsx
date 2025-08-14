export default function Triangle({
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
      <path d="M12 2L2 20h20L12 2z" />
    </svg>
  );
}
