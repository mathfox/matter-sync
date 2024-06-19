import { component } from "@rbxts/matter";
import { SyncComponent } from "../addSyncComponent";

export class Components {
	@SyncComponent()
	static readonly Component = component("Component");
}
