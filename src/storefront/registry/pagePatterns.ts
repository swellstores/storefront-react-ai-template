import type { PagePatternDefinition } from "./types";

export const pagePatterns = [
	{
		id: "home.story_first",
		kind: "home",
		name: "Story-first Home",
		summary:
			"Homepage that opens with brand atmosphere, then introduces curated products and a supporting story.",
		sectionSlots: [
			{
				id: "opening",
				required: true,
				allowedPatterns: [
					"hero.split_story",
					"hero.centered_statement",
				],
			},
			{
				id: "featured",
				required: true,
				allowedPatterns: [
					"products.editorial_rail",
					"products.featured_spread",
				],
			},
			{
				id: "story",
				required: false,
				allowedPatterns: ["story.manifesto", "story.text_image"],
			},
		],
	},
	{
		id: "home.catalog_gateway",
		kind: "home",
		name: "Catalog Gateway Home",
		summary:
			"Homepage that quickly routes shoppers into categories, bestsellers, and product discovery.",
		sectionSlots: [
			{
				id: "opening",
				required: true,
				allowedPatterns: ["hero.split_story", "hero.centered_statement"],
			},
			{
				id: "categories",
				required: true,
				allowedPatterns: ["categories.tile_gateway"],
			},
			{
				id: "products",
				required: true,
				allowedPatterns: ["products.grid", "products.carousel"],
			},
			{
				id: "trust",
				required: false,
				allowedPatterns: ["trust.icon_bar"],
			},
		],
	},
	{
		id: "home.campaign_focus",
		kind: "home",
		name: "Campaign Focus Home",
		summary:
			"Homepage built around a launch, drop, seasonal collection, promotion, or vivid brand campaign.",
		sectionSlots: [
			{
				id: "opening",
				required: true,
				allowedPatterns: ["hero.full_bleed_campaign"],
			},
			{
				id: "products",
				required: true,
				allowedPatterns: [
					"products.featured_spread",
					"products.carousel",
					"products.editorial_rail",
				],
			},
			{
				id: "rhythm",
				required: false,
				allowedPatterns: ["story.manifesto", "newsletter.simple"],
			},
		],
	},
	{
		id: "home.product_explainer",
		kind: "home",
		name: "Product Explainer Home",
		summary:
			"Homepage for considered purchases where benefits, proof, specs, and confidence matter.",
		sectionSlots: [
			{
				id: "opening",
				required: true,
				allowedPatterns: ["hero.product_expert"],
			},
			{
				id: "proof",
				required: true,
				allowedPatterns: ["trust.proof_panel", "story.text_image"],
			},
			{
				id: "products",
				required: false,
				allowedPatterns: ["products.grid", "products.featured_spread"],
			},
		],
	},
	{
		id: "collection.filterable_grid",
		kind: "collection",
		name: "Filterable Grid Collection",
		summary:
			"Collection page optimized for filters, sorting, pagination, and clear product scanning.",
		sectionSlots: [
			{
				id: "collection",
				required: true,
				allowedPatterns: ["products.grid"],
			},
		],
	},
	{
		id: "collection.curated_story",
		kind: "collection",
		name: "Curated Story Collection",
		summary:
			"Collection page that frames products as a curated edit with story and editorial pacing.",
		sectionSlots: [
			{
				id: "opening",
				required: false,
				allowedPatterns: ["hero.centered_statement", "story.manifesto"],
			},
			{
				id: "collection",
				required: true,
				allowedPatterns: ["products.editorial_rail", "products.grid"],
			},
		],
	},
	{
		id: "collection.campaign_collection",
		kind: "collection",
		name: "Campaign Collection",
		summary:
			"Collection page for a drop, launch, or seasonal campaign with higher visual energy.",
		sectionSlots: [
			{
				id: "opening",
				required: true,
				allowedPatterns: ["hero.full_bleed_campaign"],
			},
			{
				id: "collection",
				required: true,
				allowedPatterns: ["products.carousel", "products.grid"],
			},
		],
	},
	{
		id: "product.gallery_purchase",
		kind: "product",
		name: "Gallery Purchase Product Page",
		summary:
			"Product detail page with gallery, options, purchase controls, related products, and clear product storytelling.",
		sectionSlots: [
			{
				id: "product",
				required: true,
				allowedPatterns: ["products.featured_spread"],
			},
			{
				id: "related",
				required: false,
				allowedPatterns: ["products.carousel", "products.editorial_rail"],
			},
		],
	},
	{
		id: "product.expert_detail",
		kind: "product",
		name: "Expert Detail Product Page",
		summary:
			"Product detail page for technical or high-consideration products with benefits, proof, and comparison cues.",
		sectionSlots: [
			{
				id: "product",
				required: true,
				allowedPatterns: ["hero.product_expert"],
			},
			{
				id: "proof",
				required: true,
				allowedPatterns: ["trust.proof_panel", "story.text_image"],
			},
			{
				id: "related",
				required: false,
				allowedPatterns: ["products.grid", "products.carousel"],
			},
		],
	},
] as const satisfies readonly PagePatternDefinition[];
