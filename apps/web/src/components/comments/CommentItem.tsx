interface CommentItemProps {
  comment: any;
}

export default function CommentItem({
  comment,
}: CommentItemProps) {
  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <p className="font-semibold">
        {comment.author?.name || "Unknown User"}
      </p>

      <p className="mt-2">{comment.content}</p>

      <p className="mt-2 text-xs text-gray-500">
        {new Date(comment.createdAt).toLocaleString()}
      </p>
    </div>
  );
}