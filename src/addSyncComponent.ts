import type { ComponentCtor } from "@rbxts/matter/lib/component";
import { componentNameCtorMap } from "./componentNameCtorMap";

export function addSyncComponent(componentCtor: ComponentCtor) {
	componentNameCtorMap.set(tostring(componentCtor), componentCtor);
}
