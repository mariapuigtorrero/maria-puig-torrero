import { useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";
import { useClient, useDocumentOperation } from "sanity";
import { apiVersion } from "../env";

// Sustituye la acción "Eliminar" por defecto, solo para documentos de tipo
// "project": antes de borrar el proyecto, busca cualquier documento que lo
// referencie (p. ej. el array "order" de la Home) y quita esa referencia
// automáticamente, para que María nunca se encuentre con el error de
// "no se puede borrar porque está referenciado desde X".
//
// Nombrada con mayúscula inicial para que el linter de reglas de hooks de
// React reconozca los hooks (useState, useClient, useDocumentOperation) de
// aquí dentro como válidos — Sanity la invoca igual que cualquier otro
// DocumentActionComponent, el nombre no afecta a su funcionamiento.
export const CascadeDeleteAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const { id, type, onComplete } = props;
  const { delete: deleteOp } = useDocumentOperation(id, type);
  const client = useClient({ apiVersion });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return {
    label: "Eliminar",
    tone: "critical",
    disabled: isDeleting || Boolean(deleteOp.disabled),
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen && {
      type: "confirm",
      tone: "critical",
      message:
        "Se eliminará este proyecto de forma permanente, y se quitará automáticamente de cualquier sitio donde esté enlazado (como el orden de la Home).",
      onCancel: () => setDialogOpen(false),
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          // Busca cualquier documento (publicado o borrador) que tenga una
          // referencia a este proyecto.
          const referencingDocs = await client.fetch<{ _id: string }[]>(
            `*[references($id)]{ _id }`,
            { id }
          );

          if (referencingDocs.length > 0) {
            const tx = client.transaction();
            referencingDocs.forEach((doc) => {
              // Quita la entrada del array "order" (u otro array de
              // referencias) que apunte a este proyecto. La sintaxis
              // `campo[_ref=="..."]` elimina todas las coincidencias.
              tx.patch(doc._id, (p) => p.unset([`order[_ref=="${id}"]`]));
            });
            await tx.commit();
          }

          deleteOp.execute();
        } finally {
          setIsDeleting(false);
          setDialogOpen(false);
          onComplete();
        }
      },
    },
  };
};
