import {
	getPagePattern,
	getSectionPattern,
	getStoreArchetype,
	getTokenPreset,
} from "../registry";
import {
	StorefrontRecipeSchema,
	type CommerceSource,
	type StorefrontRecipe,
	type StorefrontRecipePage,
	type StorefrontRecipeSection,
} from "./schema";
import type { SectionPatternDefinition } from "../registry";

export interface RecipeValidationResult {
	success: boolean;
	recipe?: StorefrontRecipe;
	errors: string[];
}

export function validateStorefrontRecipe(input: unknown): RecipeValidationResult {
	const parsed = StorefrontRecipeSchema.safeParse(input);
	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.issues.map(
				(issue) => `${issue.path.join(".") || "recipe"}: ${issue.message}`,
			),
		};
	}

	const recipe = parsed.data;
	const errors = validateRegistryCompatibility(recipe);

	return {
		success: errors.length === 0,
		recipe,
		errors,
	};
}

function validateRegistryCompatibility(recipe: StorefrontRecipe): string[] {
	const errors: string[] = [];
	const archetype = getStoreArchetype(recipe.archetype);

	if (!archetype) {
		errors.push(`Unknown archetype "${recipe.archetype}".`);
		return errors;
	}

	if (!getTokenPreset(recipe.tokenPreset)) {
		errors.push(`Unknown token preset "${recipe.tokenPreset}".`);
	} else if (!includesId(archetype.tokenPresets, recipe.tokenPreset)) {
		errors.push(
			`Token preset "${recipe.tokenPreset}" is not allowed for archetype "${recipe.archetype}".`,
		);
	}

	for (const page of recipe.pages) {
		validatePage(page, archetype, errors);
	}

	return errors;
}

function validatePage(
	page: StorefrontRecipePage,
	archetype: NonNullable<ReturnType<typeof getStoreArchetype>>,
	errors: string[],
): void {
	const pagePattern = getPagePattern(page.pattern);
	if (!pagePattern) {
		errors.push(`Unknown page pattern "${page.pattern}" for route "${page.route}".`);
		return;
	}

	if (pagePattern.kind !== page.kind) {
		errors.push(
			`Page "${page.route}" uses kind "${page.kind}" but pattern "${page.pattern}" is "${pagePattern.kind}".`,
		);
	}

	if (!includesId(archetype.pagePatterns[page.kind], page.pattern)) {
		errors.push(
			`Page pattern "${page.pattern}" is not allowed for archetype "${archetype.id}".`,
		);
	}

	for (const slot of pagePattern.sectionSlots) {
		if (slot.required && !page.sections.some((section) => section.slot === slot.id)) {
			errors.push(
				`Page "${page.route}" pattern "${page.pattern}" requires section slot "${slot.id}".`,
			);
		}
	}

	for (const section of page.sections) {
		validateSection(page, section, errors);
	}
}

function validateSection(
	page: StorefrontRecipePage,
	section: StorefrontRecipeSection,
	errors: string[],
): void {
	const pagePattern = getPagePattern(page.pattern);
	const sectionPattern = getSectionPattern(section.pattern);

	if (!pagePattern || !sectionPattern) {
		if (!sectionPattern) {
			errors.push(
				`Unknown section pattern "${section.pattern}" in page "${page.route}".`,
			);
		}
		return;
	}

	const slot = pagePattern.sectionSlots.find(
		(candidate) => candidate.id === section.slot,
	);
	if (!slot) {
		errors.push(
			`Section slot "${section.slot}" is not defined by page pattern "${page.pattern}".`,
		);
		return;
	}

	if (!includesId(slot.allowedPatterns, section.pattern)) {
		errors.push(
			`Section pattern "${section.pattern}" is not allowed in slot "${section.slot}" for page pattern "${page.pattern}".`,
		);
	}

	if (!sourceMatchesRequirement(section.source, sectionPattern.sourceRequirement)) {
		errors.push(
			`Section "${section.slot}" uses pattern "${section.pattern}" which requires source "${sectionPattern.sourceRequirement}".`,
		);
	}
}

function includesId(values: readonly string[], value: string): boolean {
	return values.includes(value);
}

function sourceMatchesRequirement(
	source: CommerceSource | undefined,
	requirement: SectionPatternDefinition["sourceRequirement"],
): boolean {
	switch (requirement) {
		case "none":
			return true;
		case "products":
			return (
				source?.type === "products" ||
				source?.type === "category"
			);
		case "categories":
			return source?.type === "categories";
		case "product":
			return source?.type === "product";
		case "menu":
			return source?.type === "menu";
		default:
			return false;
	}
}
