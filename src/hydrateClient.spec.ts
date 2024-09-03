import { component, World, type AnyEntity } from "@rbxts/matter";
import type { ComponentsHydratePayload, WorldPayload } from "./Types";
import { hydrateClient } from "./hydrateClient";
import { expect, it } from "@rbxts/jest-globals";
import { addSyncComponent } from "./addSyncComponent";

it("should hydrate the client state", () => {
	const Component = component<{
		name: string;
	}>("Component");

	addSyncComponent(Component);

	const world = new World();

	const payload_1 = identity<WorldPayload<ComponentsHydratePayload<unknown>>>({
		"3": {
			Component: {
				name: "test",
			},
		},

		"5": {
			Component: {
				name: "second",
			},
		},

		"7": {
			Component: {
				name: "third",
			},
		},
	});

	hydrateClient(world, payload_1);

	expect(world.contains(1 as AnyEntity)).toBe(true);
	expect(world.get(1 as AnyEntity, Component)).toHaveProperty("name");

	hydrateClient(world, {});

	expect(world.size()).toBe(0);
});