import { useState } from "react";

interface CommentItemProps {
  comment: any;
  canManage?: boolean;
  onUpdate?: (commentId: string, content: string) => Promise<void>;
  onDelete?: (commentId: string) => Promise<void>;
}

export default function CommentItem({
  comment,
  canManage = false,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!content.trim() || !onUpdate) return;
    try {
      setSaving(true);
      await onUpdate(comment.id, content.trim());
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border bg-gray-50 p-3">
      <p className="font-semibold">
        {comment.author?.name || "Unknown User"}
      </p>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <textarea value={content} onChange={(event) => setContent(event.target.value)} className="w-full rounded border p-2" rows={3} />
          <div className="flex gap-2">
            <button onClick={save} disabled={saving || !content.trim()} className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => { setContent(comment.content); setIsEditing(false); }} className="rounded bg-gray-200 px-3 py-1 text-sm">Cancel</button>
          </div>
        </div>
      ) : <p className="mt-2">{comment.content}</p>}

      <p className="mt-2 text-xs text-gray-500">
        {new Date(comment.createdAt).toLocaleString()}
      </p>

      {canManage && !isEditing && (
        <div className="mt-3 flex gap-3 text-sm">
          <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline">Edit</button>
          <button onClick={() => onDelete?.(comment.id)} className="text-red-600 hover:underline">Delete</button>
        </div>
      )}
    </div>
  );
}
