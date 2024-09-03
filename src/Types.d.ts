/**
 * In case the `data` field is equal to `undefined` it means the component has been removed from the entity.
 */
export interface ComponentSyncData<TData = unknown> {
	data: TData | undefined;
}

export type ComponentsSyncPayload<TData = unknown> = {
	[componentName in string]: ComponentSyncData<TData>;
};

export type WorldPayload<TComponents> = {
	[serverEntityId in string]: TComponents;
};

export type ComponentsHydratePayload<TData = unknown> = {
	[componentName in string]: TData;
};

/**
 * @shared
 */
export interface WorldPayloadResult<TComponents> {
	payload: WorldPayload<TComponents>;
	isEmpty: boolean;
}
