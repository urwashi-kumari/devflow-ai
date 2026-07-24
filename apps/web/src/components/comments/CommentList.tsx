import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: any[];
}

export default function CommentList({
  comments,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="mt-4 text-gray-500">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
  );
}