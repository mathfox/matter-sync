import { expect, it } from "@rbxts/jest-globals";
import { component } from "@rbxts/matter";
import { addSyncComponent } from "./addSyncComponent";
import { componentNameCtorMap } from "./componentNameCtorMap";

it("should add syncable component", () => {
	const Component = component("Component");

	expect(componentNameCtorMap.has("Component")).toBe(false);

	addSyncComponent(Component);

	expect(componentNameCtorMap.has("Component")).toBe(true);
});
