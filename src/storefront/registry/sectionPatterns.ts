import type { SectionPatternDefinition } from "./types";

export const sectionPatterns = [
	{
		id: "hero.split_story",
		group: "hero",
		name: "Split Story Hero",
		summary:
			"Two-column opening with brand story, primary CTA, and one strong product or lifestyle image.",
		sourceRequirement: "none",
	},
	{
		id: "hero.centered_statement",
		group: "hero",
		name: "Centered Statement Hero",
		summary:
			"Quiet typographic opening for brands where language and atmosphere matter more than immediate merchandising.",
		sourceRequirement: "none",
	},
	{
		id: "hero.full_bleed_campaign",
		group: "hero",
		name: "Full Bleed Campaign Hero",
		summary:
			"High-impact campaign opening with full-bleed imagery, bold copy, and a strong conversion action.",
		sourceRequirement: "none",
	},
	{
		id: "hero.product_expert",
		group: "hero",
		name: "Product Expert Hero",
		summary:
			"Product-led opening focused on the main benefit, proof, and one clear buying path.",
		sourceRequirement: "product",
	},
	{
		id: "products.grid",
		group: "products",
		name: "Product Grid",
		summary:
			"Clear product grid for scanning, comparing, filtering, and browsing larger assortments.",
		sourceRequirement: "products",
	},
	{
		id: "products.editorial_rail",
		group: "products",
		name: "Editorial Product Rail",
		summary:
			"Curated horizontal product moment with context, atmosphere, and a boutique feel.",
		sourceRequirement: "products",
	},
	{
		id: "products.featured_spread",
		group: "products",
		name: "Featured Product Spread",
		summary:
			"One or two highlighted products treated as editorial stories with larger imagery and richer copy.",
		sourceRequirement: "products",
	},
	{
		id: "products.carousel",
		group: "products",
		name: "Product Carousel",
		summary:
			"Swipeable product rail for featured products, new arrivals, related items, or compact home sections.",
		sourceRequirement: "products",
	},
	{
		id: "categories.tile_gateway",
		group: "categories",
		name: "Category Tile Gateway",
		summary:
			"Visual category entry points for shoppers who need to choose a shopping path quickly.",
		sourceRequirement: "categories",
	},
	{
		id: "categories.editorial_list",
		group: "categories",
		name: "Editorial Category List",
		summary:
			"Atmospheric category presentation with stronger copy and slower, more curated pacing.",
		sourceRequirement: "categories",
	},
	{
		id: "story.manifesto",
		group: "story",
		name: "Manifesto",
		summary:
			"Short brand belief section that translates merchant values into memorable positioning.",
		sourceRequirement: "none",
	},
	{
		id: "story.text_image",
		group: "story",
		name: "Text and Image Story",
		summary:
			"Classic story block pairing copy with lifestyle, material, founder, or process imagery.",
		sourceRequirement: "none",
	},
	{
		id: "trust.icon_bar",
		group: "trust",
		name: "Trust Icon Bar",
		summary:
			"Compact service promises such as shipping, returns, secure checkout, guarantees, or support.",
		sourceRequirement: "none",
	},
	{
		id: "trust.proof_panel",
		group: "trust",
		name: "Proof Panel",
		summary:
			"Stronger trust-building section for reviews, comparisons, certifications, specs, or measurable outcomes.",
		sourceRequirement: "none",
	},
	{
		id: "newsletter.simple",
		group: "newsletter",
		name: "Simple Newsletter",
		summary:
			"Low-friction email capture for launches, editorial updates, drops, or brand stories.",
		sourceRequirement: "none",
	},
] as const satisfies readonly SectionPatternDefinition[];
