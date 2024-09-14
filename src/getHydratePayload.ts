import type { World } from "@rbxts/matter";
import type { ComponentsHydratePayload, WorldPayload, WorldPayloadResult } from "./Types";
import { componentNameCtorMap } from "./componentNameCtorMap";

/**
 * Returns the payload that represents the whole syncable state of the world.
 *
 * If the components payload of the entity is empty, it will be ommited from the result payload.
 *
 * @shared
 */
export function getHydratePayload(world: World): WorldPayloadResult<ComponentsHydratePayload<unknown>> {
	const entities: WorldPayload<ComponentsHydratePayload<unknown>> = {};

	for (const [entityId, entityData] of world) {
		const encodedEntityId = tostring(entityId);
		const components: ComponentsHydratePayload<unknown> = {};

		for (const [component, componentData] of entityData) {
			const encodedComponentName = tostring(component);

			if (componentNameCtorMap.has(encodedComponentName)) {
				if (!(encodedEntityId in entities)) {
					entities[encodedEntityId] = components;
				}

				components[encodedComponentName] = componentData;
			}
		}
	}

	return {
		payload: entities,
		isEmpty: next(entities)[0] === undefined,
	};
}
