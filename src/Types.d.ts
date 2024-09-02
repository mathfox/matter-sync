export type ComponentSyncData<T = undefined> = { data: T | undefined };

export type ComponentsPayload<T = undefined> = {
	[componentName in string]: ComponentSyncData<T>;
};

export type SyncPayload<T = undefined> = {
	[serverEntityId in string]: ComponentsPayload<T>;
};
