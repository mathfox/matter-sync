import { RunService } from "@rbxts/services";
import { ComponentsPayload, type SyncPayload } from "./Types";
import { World } from "@rbxts/matter";
import { SyncComponentsListener } from "./SyncComponentsListener";
import { values } from "@rbxts/object-utils";

export type ServerSyncerCallback<T> = (payload: SyncPayload<T>) => void;

export class ServerSyncer<T = undefined> {
	private componentsListener = new SyncComponentsListener();
	private connection: RBXScriptConnection;
	private callback?: ServerSyncerCallback<T>;

	constructor(private world: World) {
		this.connection = RunService.Heartbeat.Connect(() => {
			if (!this.callback) return;

			const changes: SyncPayload<T> = {};

			for (const [componentName, component] of pairs(this.componentsListener.componentNameCtorMap)) {
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
		});
	}

	setCallback(callback: ServerSyncerCallback<T>) {
		this.callback = callback;
	}

	getInitialPayload() {
		const entities: SyncPayload<T> = {};

		for (const [id, entityData] of this.world) {
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

				if (!this.componentsListener.hasComponentCtor(encodedComponentName)) continue;

				addComponentData(encodedComponentName, componentData as unknown as T);
			}
		}

		return entities;
	}

	destroy() {
		this.connection.Disconnect();
		this.componentsListener.destroy();
	}
}
