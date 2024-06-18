import { Modding } from "@flamework/core";

export const SyncComponent = Modding.createMetaDecorator("Property");

export type SyncComponent = typeof SyncComponent
