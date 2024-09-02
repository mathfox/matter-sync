import { component } from "@rbxts/matter";
import { addSyncComponent } from "../addSyncComponent";

export const SomeSyncableComponent = component<{
	someData: string;
}>("SomeSyncableComponent");

addSyncComponent(SomeSyncableComponent);
