import type { SchemaTypeDefinition } from "sanity";

import { caseStudy } from "./caseStudy";
import { homePage } from "./homePage";

export const schemaTypes: SchemaTypeDefinition[] = [homePage, caseStudy];

/** Document types that exist exactly once and are opened, never created. */
export const SINGLETONS = new Set(["homePage"]);
