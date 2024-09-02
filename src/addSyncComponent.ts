import type { ComponentCtor } from "@rbxts/matter/lib/component";
import { componentNameCtorMap } from "./componentNameCtorMap";

/**
 * Adds the `ComponentCtor` into a syncable components pool.
 * This pool will then be used later in order to receive data from the server.
 */
export function addSyncComponent(componentCtor: ComponentCtor): void {
	componentNameCtorMap.set(tostring(componentCtor), componentCtor);
}
