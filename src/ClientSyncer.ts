import { Modding } from "@flamework/core";
import { AnyEntity, GenericOfComponent, World } from "@rbxts/matter";
import { AnyComponent, ComponentCtor } from "@rbxts/matter/lib/component";
import Object, { values } from "@rbxts/object-utils";
import { entries } from "@rbxts/sift/out/Dictionary";
import { SyncComponent } from "SyncComponent";
import { SyncPayload } from "sync";

export class ClientSyncer {
	private entityIdMap = new Map<string, AnyEntity>();
	private componentNameCtorMap = new Map<string, (...args: any[]) => AnyComponent>();
	private connection: RBXScriptConnection;

	constructor(private world: World) {
		const constructors = Modding.getDecorators<typeof SyncComponent>();

		for (const { object } of constructors) {
			this.componentNameCtorMap.set(tostring(Object), object as unknown as ComponentCtor);
		}

		this.connection = Modding.onListenerAdded<typeof SyncComponent>((object) => {
			const decorator = Modding.getDecorator<typeof SyncComponent>(object);
			if (decorator) {
				this.componentNameCtorMap.set(tostring(Object), object as unknown as ComponentCtor);
			}
		});
	}

	sync<T>(payload: SyncPayload<T>) {
		const world = this.world;
		const entityIdMap = this.entityIdMap;

		for (const [serverEntityId, components] of entries(payload)) {
			let clientEntityId = entityIdMap.get(serverEntityId);

			if (clientEntityId !== undefined && values(components).isEmpty()) {
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

			for (const [componentName, componentData] of entries(components)) {
				const component = this.componentNameCtorMap.get(componentName);
				if (!component) continue;

				const data = componentData.data;
				if (data) {
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

	destroy() {
		this.connection.Disconnect();
	}
}
