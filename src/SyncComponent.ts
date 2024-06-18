import { Modding } from "@flamework/core";

export const SyncComponent = Modding.createDecorator("Property", (descriptor) => {
    assert(descriptor.isStatic, "Only static components can be synced!")
});

export type SyncComponent = typeof SyncComponent
