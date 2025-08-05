import { useState } from "react";
import { PublishedResumeService } from "@/services/publishedResume";
import { ResumeData } from "@/contexts/ResumeContext";

export const usePublishResume = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  /**
   * Publishes the resume. Expects encrypted data and key.
   * Returns { id, key } for shareable link.
   */
  const publishResume = async (
    encryptedResumeData: string,
    key: string,
    title?: string,
    existingId?: string
  ) => {
    setIsPublishing(true);
    try {
      const result = await PublishedResumeService.publishResume(
        encryptedResumeData,
        title,
        existingId
      );
      if (result.error) {
        throw new Error(result.error);
      }
      if (result.data) {
        setPublishedId(result.data.id);
        return { id: result.data.id, key };
      }
      return null;
    } finally {
      setIsPublishing(false);
    }
  };

  const clearPublishedId = () => {
    setPublishedId(null);
  };

  return {
    publishResume,
    isPublishing,
    publishedId,
    clearPublishedId
  };
};