import { z } from "zod";

import type {
	PageKind,
	PagePatternId,
	SectionPatternId,
	StoreArchetypeId,
	TokenPresetId,
} from "../registry";

export const storefrontRecipeVersion = 1;

const CommerceSourceSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("products"),
		limit: z.number().int().positive().max(24).optional(),
		sort: z.string().trim().min(1).optional(),
	}),
	z.object({
		type: z.literal("category"),
		slug: z.string().trim().min(1),
		limit: z.number().int().positive().max(24).optional(),
		sort: z.string().trim().min(1).optional(),
	}),
	z.object({
		type: z.literal("product"),
		slug: z.string().trim().min(1),
	}),
	z.object({
		type: z.literal("categories"),
		limit: z.number().int().positive().max(24).optional(),
	}),
	z.object({
		type: z.literal("menu"),
		id: z.string().trim().min(1),
	}),
]);

const SectionContentSchema = z
	.object({
		eyebrow: z.string().trim().min(1).optional(),
		title: z.string().trim().min(1).optional(),
		body: z.string().trim().min(1).optional(),
		ctaLabel: z.string().trim().min(1).optional(),
		ctaTo: z.string().trim().min(1).optional(),
	})
	.passthrough();

export const StorefrontRecipeSectionSchema = z.object({
	slot: z.string().trim().min(1),
	pattern: z.string().trim().min(1).transform((value) => value as SectionPatternId),
	source: CommerceSourceSchema.optional(),
	content: SectionContentSchema.optional(),
});

export const StorefrontRecipePageSchema = z.object({
	route: z.string().trim().startsWith("/"),
	kind: z
		.enum(["home", "collection", "product"])
		.transform((value) => value as PageKind),
	pattern: z.string().trim().min(1).transform((value) => value as PagePatternId),
	sections: z.array(StorefrontRecipeSectionSchema).min(1),
});

export const StorefrontRecipeSchema = z.object({
	version: z.literal(storefrontRecipeVersion),
	archetype: z
		.string()
		.trim()
		.min(1)
		.transform((value) => value as StoreArchetypeId),
	tokenPreset: z
		.string()
		.trim()
		.min(1)
		.transform((value) => value as TokenPresetId),
	pages: z.array(StorefrontRecipePageSchema).min(1),
});

export type CommerceSource = z.infer<typeof CommerceSourceSchema>;
export type StorefrontRecipeSection = z.infer<
	typeof StorefrontRecipeSectionSchema
>;
export type StorefrontRecipePage = z.infer<typeof StorefrontRecipePageSchema>;
export type StorefrontRecipe = z.infer<typeof StorefrontRecipeSchema>;
