import type { TokenPresetDefinition } from "./types";

export const tokenPresets = [
	{
		id: "quiet_luxury",
		name: "Quiet Luxury",
		summary:
			"Elegant, restrained, high-touch presentation with editorial spacing and refined serif headings.",
		useWhen: [
			"luxury",
			"jewelry",
			"fashion",
			"premium beauty",
			"gallery-like presentation",
			"timeless or heirloom language",
		],
		fonts: {
			heading: "Playfair Display",
			body: "Inter",
			accent: "Newsreader",
		},
		colorMood: "warm neutrals, ink, ivory, muted metallic accents",
		spacing: "airy",
		motion: "subtle",
		imageTreatment: "large editorial crops, soft contrast, generous whitespace",
	},
	{
		id: "warm_artisan",
		name: "Warm Artisan",
		summary:
			"Human, tactile, material-led storefronts with warmth, craft, and approachable storytelling.",
		useWhen: [
			"handmade",
			"craft",
			"home decor",
			"natural materials",
			"small batch",
			"giftable goods",
		],
		fonts: {
			heading: "Fraunces",
			body: "DM Sans",
			accent: "Source Serif 4",
		},
		colorMood: "clay, cream, olive, umber, sun-washed neutrals",
		spacing: "balanced",
		motion: "subtle",
		imageTreatment: "textured, warm, object-focused lifestyle crops",
	},
	{
		id: "clean_retail",
		name: "Clean Retail",
		summary:
			"Clear, practical ecommerce UI optimized for browsing, filters, scanning, and conversion.",
		useWhen: [
			"broad catalog",
			"many categories",
			"utility",
			"clarity",
			"filters",
			"straightforward shopping",
		],
		fonts: {
			heading: "Inter",
			body: "Inter",
		},
		colorMood: "white, graphite, light gray, restrained brand accent",
		spacing: "compact",
		motion: "none",
		imageTreatment: "consistent product crops, clean backgrounds, clear grids",
	},
	{
		id: "bold_pop",
		name: "Bold Pop",
		summary:
			"Colorful, expressive, campaign-ready styling with strong rhythm and memorable moments.",
		useWhen: [
			"playful",
			"colorful",
			"streetwear",
			"drop",
			"launch",
			"youth culture",
			"high energy",
		],
		fonts: {
			heading: "Bricolage Grotesque",
			body: "DM Sans",
			accent: "Space Grotesk",
		},
		colorMood: "saturated brand colors, high contrast, playful accent fields",
		spacing: "dramatic",
		motion: "expressive",
		imageTreatment: "bold crops, stickers, overlap, campaign-like composition",
	},
	{
		id: "technical_premium",
		name: "Technical Premium",
		summary:
			"Precise, confident, product-led styling for considered purchases and feature education.",
		useWhen: [
			"technical",
			"devices",
			"gear",
			"performance",
			"specs",
			"comparison",
			"professional",
		],
		fonts: {
			heading: "Sora",
			body: "Plus Jakarta Sans",
			accent: "JetBrains Mono",
		},
		colorMood: "graphite, blue-gray, electric accent, crisp light/dark contrast",
		spacing: "balanced",
		motion: "subtle",
		imageTreatment: "sharp product renders, spec callouts, controlled contrast",
	},
] as const satisfies readonly TokenPresetDefinition[];
