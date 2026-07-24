interface CommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function CommentForm({
  value,
  onChange,
  onSubmit,
}: CommentFormProps) {
  return (
    <div className="mt-4 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a comment..."
        className="flex-1 rounded-lg border px-4 py-2"
      />

      <button
        onClick={onSubmit}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Post
      </button>
    </div>
  );
}