import { Modding, Reflect } from "@flamework/core";

export const SyncComponentKey = "MatterSyncComponent"

/**
 * @metadata flamework:implements flamework:parameters
 */
export const SyncComponent = Modding.createDecorator("Property", (descriptor) => {
	assert(descriptor.isStatic, "Only static components can be synced!");

    Reflect.defineMetadata(descriptor.object, SyncComponentKey, true, descriptor.property)
});

export type SyncComponent = typeof SyncComponent;
