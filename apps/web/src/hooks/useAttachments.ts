import { useCallback, useEffect, useState } from "react";
import * as attachmentService from "../services/attachment";
import type { Attachment } from "../services/attachment";

export default function useAttachments(taskId: string) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAttachments = useCallback(async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      setAttachments(await attachmentService.getAttachments(taskId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    refreshAttachments();
  }, [refreshAttachments]);

  return { attachments, loading, refreshAttachments };
}
