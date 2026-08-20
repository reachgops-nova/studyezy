import "server-only";
import { db } from "../db";
import { RESOURCE_TYPES, type ResourceType } from "../unitResources";
import type { UnitResource } from "@prisma/client";

export interface ResourceFile {
  id: string;
  path: string;
  originalFilename: string;
  uploadedByEmail: string;
  approvedByEmail: string | null;
  approvedAt: Date | null;
  createdAt: Date;
}

export interface ResourceGroup {
  type: ResourceType;
  approved: ResourceFile[];
  pending: ResourceFile[];
}

function toFile(r: UnitResource & { uploadedBy: { email: string }; approvedBy: { email: string } | null }): ResourceFile {
  return {
    id: r.id,
    path: `/api/uploads/${r.storageKey}`,
    originalFilename: r.originalFilename,
    uploadedByEmail: r.uploadedBy.email,
    approvedByEmail: r.approvedBy?.email ?? null,
    approvedAt: r.approvedAt,
    createdAt: r.createdAt,
  };
}

/**
 * Every resource for a unit, grouped by type and split into approved/pending
 * - used by both the admin curation page (sees everything) and the
 * family-facing panel (only ever renders the approved half).
 */
export async function getUnitResourceGroups(unitId: string): Promise<ResourceGroup[]> {
  const rows = await db.unitResource.findMany({
    where: { unitId },
    include: { uploadedBy: { select: { email: true } }, approvedBy: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return RESOURCE_TYPES.map((type) => {
    const forType = rows.filter((r) => r.resourceType === type);
    return {
      type,
      approved: forType.filter((r) => r.status === "approved").map(toFile),
      pending: forType.filter((r) => r.status === "pending").map(toFile),
    };
  });
}

/** Just the approved files per type, for the read-only family-facing panel. */
export async function getApprovedResources(unitId: string): Promise<Record<ResourceType, ResourceFile[]>> {
  const groups = await getUnitResourceGroups(unitId);
  return Object.fromEntries(groups.map((g) => [g.type, g.approved])) as Record<ResourceType, ResourceFile[]>;
}

/** Same as getUnitResourceGroups, but takes the public unitKey - lets page
 * components (which already have unitKey, not the raw db id) fetch in one
 * call, matching getUploadedPageImages()'s existing convention in content.ts. */
export async function getUnitResourceGroupsByKey(unitKey: string): Promise<ResourceGroup[]> {
  const unit = await db.unit.findUnique({ where: { unitKey } });
  if (!unit) return [];
  return getUnitResourceGroups(unit.id);
}

export interface PendingResourceRow extends ResourceFile {
  resourceType: ResourceType;
  unitKey: string;
  unitTitle: string;
}

/**
 * Every pending (not-yet-approved) resource across every unit, newest first
 * - lets an admin see what needs review without guessing which unit's
 * dropdown to check first (2026-08-20: "admin should have a view of what
 * are the textbook/worksheets/classwork/test papers uploaded by students,
 * consolidated"). The per-unit approve/reject actions are unchanged -
 * this is purely a cross-unit read.
 */
export async function getAllPendingResources(): Promise<PendingResourceRow[]> {
  const rows = await db.unitResource.findMany({
    where: { status: "pending" },
    include: { uploadedBy: { select: { email: true } }, approvedBy: { select: { email: true } }, unit: { select: { unitKey: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((r) => ({
    ...toFile(r),
    resourceType: r.resourceType as ResourceType,
    unitKey: r.unit.unitKey,
    unitTitle: r.unit.title,
  }));
}
