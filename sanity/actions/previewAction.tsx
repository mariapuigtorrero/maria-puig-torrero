import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient } from "sanity";
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";
import { apiVersion } from "../env";

// Only "project" documents have a page of their own (/projects/[slug]) to preview.
function getPreviewPath(doc: { _type: string; slug?: { current?: string } }): string | null {
  if (doc._type === "project" && doc.slug?.current) {
    return `/projects/${doc.slug.current}`;
  }
  return null;
}

export const previewAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published, type } = props;
  const [loading, setLoading] = useState(false);
  const client = useClient({ apiVersion });

  const doc = (draft || published) as { _type: string; slug?: { current?: string } } | undefined;
  const path = doc ? getPreviewPath({ ...doc, _type: type }) : null;

  if (!path) return null;

  return {
    label: "Vista previa",
    disabled: loading,
    onHandle: async () => {
      setLoading(true);
      try {
        const studioUrl = `${window.location.origin}/studio`;
        const { secret } = await createPreviewSecret(client, "manual-preview", studioUrl);
        const url = new URL("/api/draft-mode/enable", window.location.origin);
        url.searchParams.set("sanity-preview-secret", secret);
        url.searchParams.set("sanity-preview-pathname", path);
        window.open(url.toString(), "_blank", "noopener,noreferrer");
      } finally {
        setLoading(false);
        props.onComplete();
      }
    },
  };
};
