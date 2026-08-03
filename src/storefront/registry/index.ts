export * from "./archetypes";
export * from "./pagePatterns";
export * from "./sectionPatterns";
export * from "./tokenPresets";
export * from "./types";

import { storeArchetypes } from "./archetypes";
import { pagePatterns } from "./pagePatterns";
import { sectionPatterns } from "./sectionPatterns";
import { tokenPresets } from "./tokenPresets";
import type {
	PagePatternId,
	SectionPatternId,
	StoreArchetypeId,
	TokenPresetId,
} from "./types";

export const storefrontRegistry = {
	archetypes: storeArchetypes,
	pagePatterns,
	sectionPatterns,
	tokenPresets,
} as const;

export function getStoreArchetype(id: StoreArchetypeId) {
	return storeArchetypes.find((archetype) => archetype.id === id);
}

export function getPagePattern(id: PagePatternId) {
	return pagePatterns.find((pattern) => pattern.id === id);
}

export function getSectionPattern(id: SectionPatternId) {
	return sectionPatterns.find((pattern) => pattern.id === id);
}

export function getTokenPreset(id: TokenPresetId) {
	return tokenPresets.find((preset) => preset.id === id);
}
