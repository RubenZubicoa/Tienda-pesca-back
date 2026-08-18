import { ObjectId } from "mongodb";
import { database } from "../db/database";
import type { Category } from "../entities/Category";

const collection = database.collection<Category>("categories");

export class CategoryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CategoryValidationError";
  }
}

export function normalizeChildren(
  children: unknown,
  existingChildren: Category[] | undefined,
  now: number
): Category[] {
  let parsed: unknown = children;
  if (typeof children === "string") {
    try {
      parsed = JSON.parse(children);
    } catch {
      throw new CategoryValidationError("El campo 'children' debe ser un JSON válido");
    }
  }

  if (!Array.isArray(parsed)) {
    throw new CategoryValidationError("El campo 'children' debe ser un array");
  }

  const existingMap = new Map(
    (existingChildren ?? []).map((child) => [child._id?.toString(), child])
  );

  return parsed.map((child) => {
    if (typeof child !== "object" || child === null || !("label" in child)) {
      throw new CategoryValidationError("Cada subcategoría debe tener un 'label' válido");
    }

    const input = child as { _id?: string; label: string; description?: string; image?: string };
    if (typeof input.label !== "string" || !input.label.trim()) {
      throw new CategoryValidationError("Cada subcategoría debe tener un 'label' válido");
    }

    const existing = input._id ? existingMap.get(input._id) : undefined;
    const _id = input._id ? new ObjectId(input._id) : new ObjectId();

    return {
      _id,
      label: input.label.trim(),
      description: typeof input.description === "string" ? input.description : undefined,
      image: typeof input.image === "string" ? input.image : existing?.image,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
  });
}

async function resolveRootCategoryId(id: string): Promise<ObjectId | null> {
  const _id = new ObjectId(id);
  const root = await collection.findOne({ _id, isDeleted: { $ne: true } }, { projection: { _id: 1 } });
  if (root) return _id;

  const parent = await collection.findOne(
    { "children._id": _id, isDeleted: { $ne: true } },
    { projection: { _id: 1 } }
  );
  return parent?._id ?? null;
}

export async function createCategory(
  input: Omit<Category, "_id" | "createdAt" | "updatedAt" | "isDeleted">
) {
  const now = Date.now();
  const doc: Category = {
    label: input.label.trim(),
    description: input.description,
    image: input.image,
    children: input.children ? normalizeChildren(input.children, undefined, now) : undefined,
    createdAt: now,
    updatedAt: now,
    isDeleted: false,
  };
  const result = await collection.insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listCategories() {
  return await collection.find({ isDeleted: { $ne: true } }).toArray();
}

export async function getCategoryById(id: string) {
  const _id = new ObjectId(id);
  const root = await collection.findOne({ _id, isDeleted: { $ne: true } });
  if (root) return root;

  const parent = await collection.findOne({ "children._id": _id, isDeleted: { $ne: true } });
  if (!parent?.children) return null;

  return parent.children.find((child) => child._id?.equals(_id)) ?? null;
}

export async function updateCategory(
  id: string,
  patch: Partial<Omit<Category, "_id" | "createdAt" | "children">> & { children?: unknown }
) {
  const rootId = await resolveRootCategoryId(id);
  if (!rootId) return null;

  const existing = await collection.findOne({ _id: rootId, isDeleted: { $ne: true } });
  if (!existing) return null;

  const updatedAt = Date.now();
  const requestedId = new ObjectId(id);
  const isChildUpdate = !requestedId.equals(rootId);
  const update: Partial<Category> = { updatedAt };

  if (isChildUpdate && patch.children === undefined) {
    if (!existing.children?.some((child) => child._id?.equals(requestedId))) return null;

    update.children = existing.children.map((child) => {
      if (!child._id?.equals(requestedId)) return child;

      return {
        ...child,
        label: typeof patch.label === "string" ? patch.label.trim() : child.label,
        description:
          typeof patch.description === "string" ? patch.description : child.description,
        image: typeof patch.image === "string" ? patch.image : child.image,
        updatedAt,
      };
    });
  } else {
    if (typeof patch.label === "string") update.label = patch.label.trim();
    if (patch.description !== undefined) update.description = patch.description;
    if (typeof patch.image === "string") update.image = patch.image;
    if (patch.children !== undefined) {
      update.children = normalizeChildren(patch.children, existing.children, updatedAt);
    }
  }

  if (Object.keys(update).length === 1) return existing;

  await collection.updateOne(
    { _id: rootId, isDeleted: { $ne: true } },
    { $set: update }
  );
  return await collection.findOne({ _id: rootId, isDeleted: { $ne: true } });
}

export async function deleteCategory(id: string) {
  const _id = new ObjectId(id);
  const updatedAt = Date.now();
  await collection.updateOne({ _id }, { $set: { isDeleted: true, updatedAt } });
}

