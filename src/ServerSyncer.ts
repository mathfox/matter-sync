import type { ComponentsPayload, SyncPayload } from "./Types";
import type { World } from "@rbxts/matter";
import { values } from "@rbxts/object-utils";
import { componentNameCtorMap } from "./componentNameCtorMap";

export type ServerSyncerCallback<T> = (payload: SyncPayload<T>) => void;

export class ServerSyncer<T = undefined> {
	private callback?: ServerSyncerCallback<T>;

	system(world: World) {
		if (!this.callback) return;

		const changes: SyncPayload<T> = {};

		for (const [componentName, component] of pairs(componentNameCtorMap)) {
			for (const [id, record] of world.queryChanged(component)) {
				const encodedEntityId = tostring(id);

				let components = changes[encodedEntityId];
				if (!components) {
					const newComponents: ComponentsPayload<T> = {};
					changes[encodedEntityId] = newComponents;
					components = newComponents;
				}

				if (world.contains(id)) {
					components[componentName] = { data: record.new as T | undefined };
				}
			}
		}

		if (!values(changes).isEmpty()) {
			this.callback(changes);
		}
	}

	setCallback(callback: ServerSyncerCallback<T>) {
		this.callback = callback;
	}

	getInitialPayload(world: World) {
		const entities: SyncPayload<T> = {};

		for (const [id, entityData] of world) {
			const components: ComponentsPayload<T> = {};
			const encodedEntityId = tostring(id);

			const addComponentData = (name: string, data: T) => {
				if (!(encodedEntityId in entities)) {
					entities[encodedEntityId] = components;
				}

				components[name] = { data };
			};

			for (const [component, componentData] of entityData) {
				const encodedComponentName = tostring(component);

				if (!componentNameCtorMap.has(encodedComponentName)) continue;

				addComponentData(encodedComponentName, componentData as unknown as T);
			}
		}

		return entities;
	}
}
