import type { AnyEntity, World } from "@rbxts/matter";
import type { AnyComponent, ComponentCtor } from "@rbxts/matter/lib/component";
import { values } from "@rbxts/object-utils";
import type { SyncPayload } from "./Types";
import { componentNameCtorMap } from "./componentNameCtorMap";

export class ClientSyncer<T = undefined> {
	private entityIdMap = new Map<string, AnyEntity>();

	constructor(private world: World) {}

	sync(payload: SyncPayload<T>) {
		const world = this.world;
		const entityIdMap = this.entityIdMap;

		for (const [serverEntityId, components] of pairs(payload)) {
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

			for (const [componentName, componentData] of pairs(components)) {
				const component = componentNameCtorMap.get(componentName);
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
}
