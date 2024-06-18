import { Modding, Reflect } from "@flamework/core";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { componentNameCtorMap } from "./componentNameCtorMap";

export const SyncComponentKey = "$:matter-sync@SyncComponent";

/**
 * @metadata reflect identifier flamework:parameters
 */
export const SyncComponent = Modding.createDecorator("Property", (descriptor) => {
	assert(descriptor.isStatic, "Only static components can be synced!");

	const componentCtor = descriptor.object[descriptor.property as never] as ComponentCtor;

	componentNameCtorMap.set(descriptor.property, componentCtor);

	Reflect.defineMetadata(descriptor.object, `${SyncComponentKey}.${descriptor.property}`, componentCtor);
});
