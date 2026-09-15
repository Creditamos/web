"use client"

import { ClassificationManager } from "@/components/classification-manager"
import { PageHeader } from "@/components/page-header"
import { Can } from "@/lib/scopes"

export default function ClassificationsPage() {
  return (
    <Can
      scope="clients:read"
      fallback={
        <PageHeader
          title="Classificações"
          description="Você não tem permissão para visualizar as classificações de clientes."
        />
      }
    >
      <div className="space-y-6">
        <PageHeader
          title="Classificações"
          description="Classes e grupos usados para segmentar os clientes na carteira."
        />
        <ClassificationManager />
      </div>
    </Can>
  )
}
