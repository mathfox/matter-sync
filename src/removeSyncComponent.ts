import type { ComponentCtor } from "@rbxts/matter/lib/component";
import { componentNameCtorMap } from "./componentNameCtorMap";

/**
 * Unmarks the component as the one being synced with the server.
 *
 * @client
 */
export function removeSyncComponent(componentCtor: ComponentCtor): void {
	componentNameCtorMap.delete(tostring(componentCtor));
}
