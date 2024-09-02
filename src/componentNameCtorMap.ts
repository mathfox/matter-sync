import type { AnyComponent } from "@rbxts/matter";

/**
 * This object is not intended to be used outside of the library.
 *
 * @internal
 */
export const componentNameCtorMap = new Map<
	string,
	(...args: ReadonlyArray<unknown>) => AnyComponent
>();
