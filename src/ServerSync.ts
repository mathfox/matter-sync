import type { World } from "@rbxts/matter";
import type { ComponentsPayload, SyncPayload } from "./Types";
import { componentNameCtorMap } from "./componentNameCtorMap";

export type ServerSyncerCallback<T> = (payload: SyncPayload<T>) => void;

const serverSyncCallbacks = new Map<World, ServerSyncerCallback<unknown>>();

let serverSyncCallback: ServerSyncerCallback<unknown> | undefined = undefined;

export function setServerSyncCallback(
	callback: ServerSyncerCallback<unknown>,
): void {
	serverSyncCallback = callback;
}

export function getInitialSyncPayload(world: World): SyncPayload<unknown> {
	const entities: SyncPayload<unknown> = {};

	for (const [id, entityData] of world) {
		const components: ComponentsPayload<unknown> = {};
		const encodedEntityId = tostring(id);

		const addComponentData = (name: string, data: unknown) => {
			if (!(encodedEntityId in entities)) {
				entities[encodedEntityId] = components;
			}

			components[name] = { data };
		};

		for (const [component, componentData] of entityData) {
			const encodedComponentName = tostring(component);

			if (!componentNameCtorMap.has(encodedComponentName)) continue;

			addComponentData(encodedComponentName, componentData);
		}
	}

	return entities;
}

export function serverSyncSystem(world: World): void {
	if (!serverSyncCallback) return;

	const changes: SyncPayload<unknown> = {};

	for (const [componentName, component] of componentNameCtorMap) {
		for (const [id, record] of world.queryChanged(component)) {
			const encodedEntityId = tostring(id);

			let components = changes[encodedEntityId];
			if (!components) {
				const newComponents: ComponentsPayload<unknown> = {};
				changes[encodedEntityId] = newComponents;
				components = newComponents;
			}

			if (world.contains(id)) {
				components[componentName] = { data: record.new };
			}
		}
	}

	if (next(changes)[0] !== undefined) {
		serverSyncCallback(changes);
	}
}
