export default function Checkbox({
  children,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <label className="flex items-center space-x-3 p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-purple-500/50 transition-colors">
      <input
        type="checkbox"
        className="bg-zinc-900 border-zinc-800 text-purple-500
         focus:ring-1 focus:ring-purple-500 focus:ring-offset-zinc-900
         rounded shadow-sm"
        {...props}
      />
      <span className="text-sm text-gray-300">{children}</span>
    </label>
  );
}
