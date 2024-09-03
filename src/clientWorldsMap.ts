import type { World, AnyEntity } from "@rbxts/matter";

/**
 * The purpose of the WeakMap here is to free up the memory when `World` is no longer referenced anywhere.
 */
export const clientWorldsMap = new WeakMap<World, Map<string, AnyEntity>>();
