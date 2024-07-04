import { component } from "@rbxts/matter";
import { addSyncComponent } from "../addSyncComponent";

export const Component = component<{
	someData: string;
}>("Component");
addSyncComponent(Component);
