import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.log("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await queries.getProductById(String(id));

    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.status(200).json(product);
  } catch (error) {
    console.log("Error getting product:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const products = await queries.getProductByUserId(userId);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting user products:", error);
    return res.status(500).json({ error: "Failed to get products" });
  }
};
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      res
        .status(400)
        .json({ error: "Tile, description and imageUrl are required " });
      return;
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const existingProduct = await queries.getProductById(String(id));
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only update your own products" });
    }

    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Title, description and imageUrl are required" });
    }
    const product = await queries.updateProduct(String(id), {
      title,
      description,
      imageUrl,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.error("Error updating product", error);
    return res.status(500).json({ error: "Failed to update product" });
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const existingProduct = await queries.getProductById(String(id));
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    if (existingProduct.userId !== userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only delete your own products" });
    }
    await queries.deleteProduct(String(id));
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
