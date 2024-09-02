import type { AnyEntity, World } from "@rbxts/matter";
import type { AnyComponent, ComponentCtor } from "@rbxts/matter/lib/component";
import type {
	ComponentSyncData,
	ComponentsPayload,
	SyncPayload,
} from "./Types";
import { componentNameCtorMap } from "./componentNameCtorMap";

const worldsMap = new WeakMap<World, Map<string, AnyEntity>>();

/**
 * Should be invoked by the remote handler.
 */
export function syncClient(world: World, payload: SyncPayload<unknown>): void {
	let entityIdMap = worldsMap.get(world);
	if (!entityIdMap) {
		entityIdMap = new Map();
		worldsMap.set(world, entityIdMap);
	}

	for (const [serverEntityId, components] of payload as unknown as Map<
		string,
		ComponentsPayload<unknown>
	>) {
		let clientEntityId = entityIdMap.get(serverEntityId);

		if (clientEntityId !== undefined && next(components)[0] === undefined) {
			if (world.contains(clientEntityId)) {
				world.despawn(clientEntityId);
			}

			entityIdMap.delete(serverEntityId);

			continue;
		}

		const componentsToInsert = new Array<AnyComponent>();
		const componentsToRemove = new Array<ComponentCtor>();

		const insertNames = new Array<string>();
		const removeNames = new Array<string>();

		for (const [componentName, componentData] of components as unknown as Map<
			string,
			ComponentSyncData<unknown>
		>) {
			const component = componentNameCtorMap.get(componentName);
			if (!component) continue;

			const data = componentData.data;
			if (data !== undefined) {
				componentsToInsert.push(component(data));
				insertNames.push(componentName);
			} else {
				componentsToRemove.push(component);
				removeNames.push(componentName);
			}
		}

		if (!clientEntityId) {
			if (componentsToInsert.isEmpty()) continue;

			clientEntityId = world.spawn(...componentsToInsert);

			entityIdMap.set(serverEntityId, clientEntityId);
		} else {
			if (!componentsToInsert.isEmpty()) {
				world.insert(clientEntityId, ...componentsToInsert);
			}

			if (!componentsToRemove.isEmpty()) {
				world.remove(clientEntityId, ...componentsToRemove);
			}
		}
	}
}

export function hydrateClient(
	world: World,
	hydratePayload: SyncPayload<unknown>,
): void {}
