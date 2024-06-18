import { AnyEntity } from "@rbxts/matter";
import { SyncPayload } from "sync";

export class ClientSyncer {
	private entityIdMap = new Map<string, AnyEntity>();

	sync<T>(payload: SyncPayload<T>) {
		for (const [serverEntityId, components] of entities) {
			let clientEntityId = entityIdMap.get(serverEntityId);

			if (clientEntityId !== undefined && components.isEmpty()) {
				// ! Важно удостовериться что клиент сам не уничтожил данную сущность
				if (world.contains(clientEntityId)) {
					world.despawn(clientEntityId);
				}

				entityIdMap.delete(serverEntityId);
				// logger.Info(`Despawning clientEntityId(${clientEntityId}) - serverEntityId(${serverEntityId})`);

				continue;
			}

			const componentsToInsert = new Array<ReplicatableComponent>();
			const componentsToRemove = new Array<GenericComponentCtor<ReplicatableComponent>>();

			const insertNames = new Array<ReplicatableComponentName>();
			const removeNames = new Array<ReplicatableComponentName>();

			for (const [componentName, componentData] of components) {
				const component = ReplicatableComponents[componentName] as ReplicatableComponentCtor;

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

				// logger.Info(
				// 	`Spawning clientEntityId(${clientEntityId}):serverEntityId(${serverEntityId}) with ${insertNames.join(",")}`,
				// );
			} else {
				if (!componentsToInsert.isEmpty()) {
					world.insert(clientEntityId, ...componentsToInsert);
				}

				if (!componentsToRemove.isEmpty()) {
					world.remove(clientEntityId, ...componentsToRemove);
				}

				// logger.Info(
				// 	`Modify clientEntityId(${clientEntityId}):serverEntityId(${serverEntityId}) adding ${insertNames.isEmpty() ? "nothing" : insertNames.join(", ")}, removing ${removeNames.isEmpty() ? "nothing" : removeNames.join(", ")}`,
				// );
			}
		}
	}
}
