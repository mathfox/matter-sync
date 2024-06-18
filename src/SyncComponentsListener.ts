import { Modding } from "@flamework/core";
import { AnyComponent } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { SyncComponentKey } from "./SyncComponent";

export class SyncComponentsListener {
	componentNameCtorMap = new Map<string, (...args: any[]) => AnyComponent>();
	private connection: RBXScriptConnection;

	constructor() {
		for (const { object } of Modding.getDecorators(SyncComponentKey)) {
			this.componentNameCtorMap.set(tostring(object), object as unknown as ComponentCtor);
		}

		this.connection = Modding.onListenerAdded((object) => {
			const decorator = Modding.getDecorator(object, SyncComponentKey);
			if (decorator) {
				this.componentNameCtorMap.set(tostring(object), object as unknown as ComponentCtor);
			}
		}, SyncComponentKey);

		for (const [] of pairs(Modding)) {
		}
	}

	getComponentCtor(componentName: string) {
		return this.componentNameCtorMap.get(componentName);
	}

	hasComponentCtor(componentName: string) {
		return this.componentNameCtorMap.has(componentName);
	}

	destroy() {
		this.connection.Disconnect();
	}
}
