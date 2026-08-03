import type { StoreArchetypeDefinition } from "./types";

export const storeArchetypes = [
	{
		id: "brand_story",
		name: "Brand Story",
		summary:
			"Atmospheric storefronts that sell through story, taste, curation, craft, and brand feeling.",
		useWhen: [
			"merchant emphasizes brand origin, craft, materials, values, lifestyle, beauty, luxury, or curation",
			"products benefit from editorial presentation rather than dense comparison",
			"the shopper should feel the world of the brand before browsing deeply",
		],
		avoidWhen: [
			"the catalog is large and utility-driven",
			"the brief asks primarily for filters, specs, or comparison",
			"the merchant wants discount marketplace energy",
		],
		primaryJob:
			"Create desire through atmosphere, story, curation, and visual taste.",
		tokenPresets: ["quiet_luxury", "warm_artisan"],
		pagePatterns: {
			home: ["home.story_first", "home.catalog_gateway"],
			collection: ["collection.curated_story", "collection.filterable_grid"],
			product: ["product.gallery_purchase"],
		},
		sectionPatterns: [
			"hero.split_story",
			"hero.centered_statement",
			"products.editorial_rail",
			"products.featured_spread",
			"categories.editorial_list",
			"story.manifesto",
			"story.text_image",
			"trust.icon_bar",
			"newsletter.simple",
		],
	},
	{
		id: "catalog_shop",
		name: "Catalog Shop",
		summary:
			"Clear, practical storefronts that help shoppers browse categories, filter products, compare options, and buy quickly.",
		useWhen: [
			"merchant has a broad catalog, many categories, or practical goods",
			"the shopper needs clarity, filtering, sorting, and product scanning",
			"conversion depends on reducing friction more than building mystique",
		],
		avoidWhen: [
			"the brief asks for a single cinematic campaign moment",
			"the catalog is tiny and needs education or storytelling instead",
			"the merchant wants highly expressive brand-first visuals",
		],
		primaryJob:
			"Help shoppers find the right item quickly and confidently.",
		tokenPresets: ["clean_retail", "technical_premium"],
		pagePatterns: {
			home: ["home.catalog_gateway"],
			collection: ["collection.filterable_grid"],
			product: ["product.gallery_purchase", "product.expert_detail"],
		},
		sectionPatterns: [
			"hero.split_story",
			"hero.centered_statement",
			"products.grid",
			"products.carousel",
			"categories.tile_gateway",
			"trust.icon_bar",
			"newsletter.simple",
		],
	},
	{
		id: "campaign_launch",
		name: "Campaign Launch",
		summary:
			"Focused storefronts for drops, launches, seasonal moments, expressive promotions, and high-energy brand campaigns.",
		useWhen: [
			"merchant mentions a launch, drop, collection, capsule, season, limited edition, or promotion",
			"the visual direction asks for color, motion, playfulness, energy, or memorability",
			"the store should concentrate attention around a small number of products or one campaign",
		],
		avoidWhen: [
			"the shopper needs a calm catalog with many filters",
			"the brief asks for quiet, understated, or utilitarian presentation",
			"the product requires heavy specs and proof before emotional appeal",
		],
		primaryJob:
			"Create energy, urgency, memorability, and a strong call to action.",
		tokenPresets: ["bold_pop", "quiet_luxury"],
		pagePatterns: {
			home: ["home.campaign_focus", "home.story_first"],
			collection: ["collection.campaign_collection", "collection.curated_story"],
			product: ["product.gallery_purchase"],
		},
		sectionPatterns: [
			"hero.full_bleed_campaign",
			"products.featured_spread",
			"products.carousel",
			"products.editorial_rail",
			"categories.tile_gateway",
			"story.manifesto",
			"trust.icon_bar",
			"newsletter.simple",
		],
	},
	{
		id: "product_expert",
		name: "Product Expert",
		summary:
			"Confidence-building storefronts for high-consideration products where education, proof, benefits, and details matter.",
		useWhen: [
			"merchant sells technical, performance, wellness, professional, B2B, or high-consideration products",
			"the shopper needs explanation, specs, comparison, proof, or trust before buying",
			"the brief emphasizes innovation, quality, reliability, outcomes, or expertise",
		],
		avoidWhen: [
			"the merchant mainly needs a vibe-heavy editorial brand world",
			"the product is impulse-driven and campaign-first",
			"the catalog is broad and simple browsing is more important than education",
		],
		primaryJob:
			"Explain value clearly and build trust through details, benefits, and evidence.",
		tokenPresets: ["technical_premium", "clean_retail"],
		pagePatterns: {
			home: ["home.product_explainer", "home.catalog_gateway"],
			collection: ["collection.filterable_grid"],
			product: ["product.expert_detail", "product.gallery_purchase"],
		},
		sectionPatterns: [
			"hero.product_expert",
			"products.grid",
			"products.featured_spread",
			"products.carousel",
			"story.text_image",
			"trust.proof_panel",
			"trust.icon_bar",
			"newsletter.simple",
		],
	},
] as const satisfies readonly StoreArchetypeDefinition[];
