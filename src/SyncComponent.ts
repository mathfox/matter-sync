import { Modding, Reflect } from "@flamework/core";

export const SyncComponentKey = "$:matter-sync@SyncComponent";

/**
 * @metadata flamework:parameters
 */
export const SyncComponent = Modding.createDecorator("Property", (descriptor) => {
	assert(descriptor.isStatic, "Only static components can be synced!");

	Reflect.defineMetadata(descriptor.object, SyncComponentKey, true, descriptor.property);
});
