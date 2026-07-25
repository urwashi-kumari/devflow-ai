import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: any[];
  currentUserId?: string;
  onUpdate?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
}

export default function CommentList({
  comments,
  currentUserId,
  onUpdate,
  onDelete,
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
          canManage={comment.authorId === currentUserId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
