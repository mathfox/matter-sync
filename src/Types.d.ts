export type ComponentsPayload<T = undefined> = {
	[componentName in string]: { data: T | undefined };
};

export type SyncPayload<T = undefined> = {
	[serverEntityId in string]: ComponentsPayload<T>;
};
