import { expect, it } from "@rbxts/jest-globals";
import { type AnyEntity, World, component } from "@rbxts/matter";
import { syncClient } from "./ClientSync";
import type { SyncPayload } from "./Types";
import { addSyncComponent } from "./addSyncComponent";

it("should sync the client", () => {
	const Component = component<{
		value: number;
	}>("Component");

	addSyncComponent(Component);

	const payload = identity<SyncPayload<unknown>>({
		"3": {
			Component: { data: { value: 3 } },
		},
	});

	const world = new World();

	expect(world.contains(1 as AnyEntity)).toBe(false);

	syncClient(world, payload);

	expect(world.contains(1 as AnyEntity)).toBe(true);
});
