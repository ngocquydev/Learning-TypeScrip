import { db } from "./index";
import { desc, eq } from "drizzle-orm";
import {
  user,
  comments,
  products,
  type NewUser,
  type NewComment,
  type NewProduct,
} from "./schema";
export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(user).values(data).returning();
  return user;
};
export const getUserById = async (id: string) => {
  return db.query.users.findFirst({
    where: eq(user.id, id),
  });
};
export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const [user] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, id))
    .returning();
  return user;
};
export const upSertUser = async (data: NewUser) => {
  const existingUser = await getUserById(data.id);
  if (existingUser) return updateUser(data.id, data);
  return createUser(data);
};
export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};
export const getAllProducts = async () => {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};
export const getAllProducts = async () => {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};
export const getProductById = async (id: string) => {
  return db.query.findFirst(products, {
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};
export const getProductByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};
export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};
export const deleteProduct = async (id: string) => {
  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};
export const createComment = async (data: NewComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};
export const deleteComment = async (id: string) => {
  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};
export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};
