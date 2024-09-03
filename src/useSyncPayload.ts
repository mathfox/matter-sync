import type { World } from "@rbxts/matter";
import type {
	ComponentsSyncPayload,
	WorldPayload,
	WorldPayloadResult,
} from "./Types";
import { componentNameCtorMap } from "./componentNameCtorMap";

/**
 * A hook that should be called each frame.
 *
 * Returns a payload that contains all of the changes since the last frame.
 *
 * @shared
 */
export function useSyncPayload(world: World): WorldPayloadResult {
	const changes: WorldPayload<ComponentsSyncPayload<unknown>> = {};

	for (const [componentName, component] of componentNameCtorMap) {
		for (const [entityId, record] of world.queryChanged(component)) {
			const encodedEntityId = tostring(entityId);

			let components = changes[encodedEntityId];
			if (!components) {
				const newComponents: ComponentsSyncPayload<unknown> = {};
				changes[encodedEntityId] = newComponents;
				components = newComponents;
			}

			if (world.contains(entityId)) {
				components[componentName] = { data: record.new };
			}
		}
	}

	return {
		payload: changes,
		isEmpty: next(changes)[0] === undefined,
	};
}
