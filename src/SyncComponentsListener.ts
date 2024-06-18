import { Modding } from "@flamework/core";
import { AnyComponent } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";
import { SyncComponent } from "./SyncComponent";

export class SyncComponentsListener {
	componentNameCtorMap = new Map<string, (...args: any[]) => AnyComponent>();
	private connection: RBXScriptConnection;

	constructor() {
		const constructors = Modding.getDecorators<SyncComponent>();

		for (const { object } of constructors) {
			this.componentNameCtorMap.set(tostring(object), object as unknown as ComponentCtor);
		}

		this.connection = Modding.onListenerAdded<SyncComponent>((object) => {
			const decorator = Modding.getDecorator<SyncComponent>(object);
			if (decorator) {
				this.componentNameCtorMap.set(tostring(object), object as unknown as ComponentCtor);
			}
		});
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
