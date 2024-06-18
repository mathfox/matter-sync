export type ComponentsPayload<T> = {
	[componentName in string]: { data: T | undefined };
};

export type SyncPayload<T> = {
	[serverEntityId in string]: ComponentsPayload<T>;
};

export const sync = {};
