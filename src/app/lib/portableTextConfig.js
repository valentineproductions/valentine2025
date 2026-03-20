/**
 * Shared Portable Text component config.
 * Handles unknown/undefined block types that can occur when:
 * - Sanity content has malformed blocks (missing _type)
 * - GROQ queries return unexpected structure
 * - Custom block types aren't defined in components
 */
export const defaultPortableTextComponents = {
  // Handle unknown block types (including "undefined") gracefully
  unknownType: () => null,
  // Explicitly handle the string "undefined" as block type (common Sanity edge case)
  types: {
    undefined: () => null,
  },
};
