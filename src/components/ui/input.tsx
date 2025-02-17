export default function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return (
    <input
      type="text"
      className="w-full bg-zinc-900 border-zinc-800 text-gray-100 placeholder-gray-500
         focus:border-purple-500 focus:ring-1 focus:ring-purple-500
         rounded-md shadow-sm p-1"
      {...props}
    />
  );
}
