import type { World } from "@rbxts/matter";
import type {
	ComponentsHydratePayload,
	ComponentsSyncPayload,
	WorldPayload,
} from "./Types";
import { componentNameCtorMap } from "./componentNameCtorMap";

export interface WorldPayloadResult {
	payload: WorldPayload<unknown>;
	isEmpty: boolean;
}

/**
 * Returns the payload that represents the whole syncable state of the world.
 *
 * If the components payload of the entity is empty, it will be ommited from the result payload.
 */
export function getHydratePayload(world: World): WorldPayloadResult {
	const entities: WorldPayload<ComponentsHydratePayload<unknown>> = {};

	for (const [serverEntityId, entityData] of world) {
		const encodedServerEntityId = tostring(serverEntityId);
		const components: ComponentsHydratePayload<unknown> = {};

		for (const [component, componentData] of entityData) {
			const encodedComponentName = tostring(component);

			if (componentNameCtorMap.has(encodedComponentName)) {
				if (!(encodedServerEntityId in entities)) {
					entities[encodedServerEntityId] = components;
				}

				components[encodedComponentName] = { data: componentData };
			}
		}
	}

	return {
		payload: entities,
		isEmpty: next(entities)[0] === undefined,
	};
}

/**
 * A hook that should be called each frame.
 *
 * Returns a payload that contains all of the changes since the last frame.
 */
export function useSyncPayload(world: World): WorldPayloadResult {
	const changes: WorldPayload<ComponentsSyncPayload<unknown>> = {};

	for (const [componentName, component] of componentNameCtorMap) {
		for (const [serverEntityId, record] of world.queryChanged(component)) {
			const encodedServerEntityId = tostring(serverEntityId);

			let components = changes[encodedServerEntityId];
			if (!components) {
				const newComponents: ComponentsSyncPayload<unknown> = {};
				changes[encodedServerEntityId] = newComponents;
				components = newComponents;
			}

			if (world.contains(serverEntityId)) {
				components[componentName] = { data: record.new };
			}
		}
	}

	return {
		payload: changes,
		isEmpty: next(changes)[0] === undefined,
	};
}
