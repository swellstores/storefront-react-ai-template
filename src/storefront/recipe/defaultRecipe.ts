import { storefrontRecipeVersion, type StorefrontRecipe } from "./schema";

export const defaultStorefrontRecipe = {
	version: storefrontRecipeVersion,
	archetype: "brand_story",
	tokenPreset: "warm_artisan",
	pages: [
		{
			route: "/",
			kind: "home",
			pattern: "home.story_first",
			sections: [
				{
					slot: "opening",
					pattern: "hero.split_story",
					content: {
						eyebrow: "Swell storefront",
						title: "A storefront shaped around your brand story.",
						body: "Use the registry to choose an archetype, page patterns, section patterns, and real commerce sources.",
						ctaLabel: "Shop products",
						ctaTo: "/products",
					},
				},
				{
					slot: "featured",
					pattern: "products.editorial_rail",
					source: {
						type: "products",
						limit: 4,
						sort: "created_desc",
					},
				},
				{
					slot: "story",
					pattern: "story.manifesto",
					content: {
						title: "Pattern-driven by default.",
						body: "The agent chooses from curated patterns while the template owns implementation quality.",
					},
				},
			],
		},
	],
} as const satisfies StorefrontRecipe;
