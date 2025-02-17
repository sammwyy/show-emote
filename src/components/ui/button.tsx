export default function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  const color = props.disabled ? "bg-zinc-800" : "bg-purple-600";
  const hoverColor = props.disabled ? "bg-zinc-700" : "bg-purple-700";

  return (
    <button
      className={`inline-flex items-center px-4 py-2 rounded-md ${color} hover:${hoverColor} focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors ${
        !props.disabled && "shadow-lg shadow-purple-500/20"
      }`}
      {...props}
    ></button>
  );
}
