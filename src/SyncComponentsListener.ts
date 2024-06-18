import { Modding, Reflect } from "@flamework/core";
import { AnyComponent } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { SyncComponent } from "./SyncComponent";
import { componentNameCtorMap } from "./componentNameCtorMap";

export class SyncComponentsListener {
	// private connection: RBXScriptConnection;

	constructor() {
		// for (const { object } of Modding.getDecorators<typeof SyncComponent>()) {
		// 	componentNameCtorMap.set(tostring(object), object as unknown as ComponentCtor);
		// }

		// this.connection = Modding.onListenerAdded<typeof SyncComponent>((object) => {
		// 	const decorator = Modding.getDecorator<typeof SyncComponent>(object);
		// 	if (decorator) {
		// 		this.componentNameCtorMap.set(tostring(object), object as unknown as ComponentCtor);
		// 	}
		// });
	}

	getComponentCtor(componentName: string) {
		return componentNameCtorMap.get(componentName);
	}

	hasComponentCtor(componentName: string) {
		return componentNameCtorMap.has(componentName);
	}

	destroy() {
		// this.connection.Disconnect();
	}
}
