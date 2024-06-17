import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export type ComponentsPayload = Map<ReplicatableComponentName, { data: ReplicatableComponentData | undefined }>;

export type EntitiesPayload = Map<string, ComponentsPayload>;

export const SyncPayload = variantModule({
    Init: {},
    Patch: {}
})

export type SyncPayload<T extends TypeNames<typeof SyncPayload> = undefined> = VariantOf<typeof SyncPayload, T>;


export const sync = {}
