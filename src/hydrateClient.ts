import type { World } from "@rbxts/matter";
import type { AnyComponent } from "@rbxts/matter/lib/component";
import type { ComponentsHydratePayload, WorldPayload } from "./Types";
import { clientWorldsMap } from "./clientWorldsMap";
import { componentNameCtorMap } from "./componentNameCtorMap";

/**
 * Hydrates the client with the latest state of the world on the server.
 *
 * This function will throw an error if the `payload` is corrupted.
 *
 * @client
 */
export function hydrateClient(world: World, payload: WorldPayload<ComponentsHydratePayload<unknown>>): void {
	let entityIdMap = clientWorldsMap.get(world);
	if (!entityIdMap) {
		entityIdMap = new Map();
		clientWorldsMap.set(world, entityIdMap);
	}

	for (const [serverEntityId, components] of payload as unknown as Map<string, ComponentsHydratePayload<unknown>>) {
		let clientEntityId = entityIdMap.get(serverEntityId);

		const componentsToInsert = new Array<AnyComponent>();

		for (const [componentName, data] of components as unknown as Map<string, unknown>) {
			const component = componentNameCtorMap.get(componentName);
			if (component) {
				componentsToInsert.push(component(data));
			}
		}

		assert(!componentsToInsert.isEmpty(), "server sent corrupt hydrate data");

		if (clientEntityId === undefined) {
			clientEntityId = world.spawn(...componentsToInsert);

			entityIdMap.set(serverEntityId, clientEntityId);
		} else {
			world.replace(clientEntityId, ...componentsToInsert);
		}
	}

	for (const [entityId] of world) {
		let doesExistOnServer = false;

		for (const [serverEntityId, clientEntityId] of entityIdMap) {
			if (clientEntityId === entityId) {
				doesExistOnServer = true;

				entityIdMap.delete(serverEntityId);

				break;
			}
		}

		if (!doesExistOnServer) {
			world.despawn(entityId);
		}
	}
}
