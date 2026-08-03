export type StoreArchetypeId =
	| "brand_story"
	| "catalog_shop"
	| "campaign_launch"
	| "product_expert";

export type PageKind = "home" | "collection" | "product";

export type TokenPresetId =
	| "quiet_luxury"
	| "warm_artisan"
	| "clean_retail"
	| "bold_pop"
	| "technical_premium";

export type PagePatternId =
	| "home.story_first"
	| "home.catalog_gateway"
	| "home.campaign_focus"
	| "home.product_explainer"
	| "collection.filterable_grid"
	| "collection.curated_story"
	| "collection.campaign_collection"
	| "product.gallery_purchase"
	| "product.expert_detail";

export type SectionPatternId =
	| "hero.split_story"
	| "hero.centered_statement"
	| "hero.full_bleed_campaign"
	| "hero.product_expert"
	| "products.grid"
	| "products.editorial_rail"
	| "products.featured_spread"
	| "products.carousel"
	| "categories.tile_gateway"
	| "categories.editorial_list"
	| "story.manifesto"
	| "story.text_image"
	| "trust.icon_bar"
	| "trust.proof_panel"
	| "newsletter.simple";

export interface StoreArchetypeDefinition {
	id: StoreArchetypeId;
	name: string;
	summary: string;
	useWhen: readonly string[];
	avoidWhen: readonly string[];
	primaryJob: string;
	tokenPresets: readonly TokenPresetId[];
	pagePatterns: Readonly<Record<PageKind, readonly PagePatternId[]>>;
	sectionPatterns: readonly SectionPatternId[];
}

export interface TokenPresetDefinition {
	id: TokenPresetId;
	name: string;
	summary: string;
	useWhen: readonly string[];
	fonts: {
		heading: string;
		body: string;
		accent?: string;
	};
	colorMood: string;
	spacing: "compact" | "balanced" | "airy" | "dramatic";
	motion: "none" | "subtle" | "expressive";
	imageTreatment: string;
}

export interface PagePatternDefinition {
	id: PagePatternId;
	kind: PageKind;
	name: string;
	summary: string;
	sectionSlots: readonly {
		id: string;
		required: boolean;
		allowedPatterns: readonly SectionPatternId[];
	}[];
}

export interface SectionPatternDefinition {
	id: SectionPatternId;
	group:
		| "hero"
		| "products"
		| "categories"
		| "story"
		| "trust"
		| "newsletter";
	name: string;
	summary: string;
	sourceRequirement: "none" | "products" | "categories" | "product" | "menu";
}
