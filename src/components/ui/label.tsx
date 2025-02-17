export default function Label(
  props: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
) {
  return (
    <label
      className="block text-sm font-medium text-gray-300 mb-2"
      {...props}
    />
  );
}
