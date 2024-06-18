import { Modding, Reflect } from "@flamework/core";

export const SyncComponentKey = "$:matter-sync@SyncComponent";

/**
 * @metadata reflect identifier flamework:parameters
 */
export const SyncComponent = Modding.createDecorator("Property", (descriptor) => {
	assert(descriptor.isStatic, "Only static components can be synced!");

	Reflect.defineMetadata(
		descriptor.object,
		SyncComponentKey,
		`${SyncComponentKey}.${descriptor.property}`,
		descriptor.property,
	);
});
