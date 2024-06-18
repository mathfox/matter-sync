import { Modding } from "@flamework/core";

export const SyncComponent = Modding.createDecorator("Property", (descriptor) => {
	assert(descriptor.isStatic, "Only static components can be synced!");
});

/**
 * @metadata flamework:implements flamework:parameters injectable
 */
export type SyncComponent = typeof SyncComponent;
