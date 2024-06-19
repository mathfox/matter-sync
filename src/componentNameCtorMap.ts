import type { AnyComponent } from "@rbxts/matter";

export const componentNameCtorMap = new Map<
	string,
	(...args: any[]) => AnyComponent
>();
