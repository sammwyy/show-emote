export default function Select(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) {
  return (
    <select
      className="w-full bg-zinc-900 border-zinc-800 text-gray-100
         focus:border-purple-500 focus:ring-1 focus:ring-purple-500
         rounded-md shadow-sm p-1"
      {...props}
    />
  );
}
