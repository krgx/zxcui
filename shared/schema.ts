import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  productCount: integer("product_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").references(() => collections.id),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  configurations: jsonb("configurations"),
  dimensions: text("dimensions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Materials table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: integer("category").notNull(), // 1-15 categories
  priceMultiplier: decimal("price_multiplier", { precision: 5, scale: 2 }).default("1.00"),
  description: text("description"),
  colorCode: text("color_code"),
});

// Mechanisms table
export const mechanisms = pgTable("mechanisms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// Product configurations
export const productConfigurations = pgTable("product_configurations", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // straight, l-shape, u-shape
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas for API
export const insertCollectionSchema = createInsertSchema(collections).pick({
  name: true,
  description: true,
  imageUrl: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  collectionId: true,
  name: true,
  description: true,
  basePrice: true,
  imageUrl: true,
  configurations: true,
  dimensions: true,
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  name: true,
  category: true,
  priceMultiplier: true,
  description: true,
  colorCode: true,
});

export const insertMechanismSchema = createInsertSchema(mechanisms).pick({
  name: true,
  description: true,
  price: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
});

// Types
export type Collection = typeof collections.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type Mechanism = typeof mechanisms.$inferSelect;
export type ProductConfiguration = typeof productConfigurations.$inferSelect;
export type User = typeof users.$inferSelect;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type InsertMechanism = z.infer<typeof insertMechanismSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// API Response types for external API
export const ApiCollectionSchema = z.object({
  id: z.number(),
  label: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  defaults: z.object({
    mechanism: z.string(),
    baseFinish: z.string()
  }),
  pricing_strategy_id: z.number(),
  category_id: z.number(),
  template_id: z.number(),
  pricing_strategy: z.object({
    engine: z.string(),
    parameters: z.any(),
    updated_at: z.string(),
    created_at: z.string(),
    id: z.number()
  }),
  template: z.object({
    updated_at: z.string(),
    compatible_subcategories: z.array(z.string()),
    constraint_dsl: z.array(z.string()),
    id: z.number(),
    created_at: z.string(),
    label: z.string(),
    category_id: z.number()
  }),
  category: z.object({
    updated_at: z.string(),
    group_id: z.number(),
    id: z.number(),
    created_at: z.string(),
    label: z.string()
  })
});

export const ApiProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  base_price: z.string(),
  image_url: z.string().optional(),
  configurations: z.array(z.any()).optional(),
  dimensions: z.string().optional(),
});

export const ApiConfigurationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  base_price: z.string(),
  image_url: z.string().optional(),
});

export const ApiMaterialSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.number(),
  price_multiplier: z.string(),
  description: z.string().optional(),
  color_code: z.string().optional(),
});

export const ApiMechanismSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  price: z.string(),
});

export const PriceCalculationRequest = z.object({
  product_id: z.number(),
  configuration_id: z.number().optional(),
  material_id: z.number().optional(),
  mechanism_ids: z.array(z.number()).optional(),
  quantity: z.number().default(1),
});

export const PriceCalculationResponse = z.object({
  base_price: z.string(),
  material_cost: z.string(),
  mechanism_cost: z.string(),
  total: z.string(),
  breakdown: z.record(z.string()),
});

export type ApiCollection = z.infer<typeof ApiCollectionSchema>;
export type ApiProduct = z.infer<typeof ApiProductSchema>;
export type ApiConfiguration = z.infer<typeof ApiConfigurationSchema>;
export type ApiMaterial = z.infer<typeof ApiMaterialSchema>;
export type ApiMechanism = z.infer<typeof ApiMechanismSchema>;
export type PriceCalculationReq = z.infer<typeof PriceCalculationRequest>;
export type PriceCalculationRes = z.infer<typeof PriceCalculationResponse>;
