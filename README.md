# matter-sync

Server to client data sync solution for the Matter ECS.

## Basic Usage

Client:

```ts
const Effect = component("Effect")

addSyncComponent(Effect)

someRemotes.syncPayload.connect((payload) => {
    syncClient(world, payload)
})

someRemotes.hydratePayload.connect((payload) => {
    hydrateClient(world, payload)
})
```

Server:

```ts
// This is supposed to be a system
const result = useSyncPayload(world)
if (!result.isEmpty) {
    someRemotes.syncPayload.fireAll(result.payload)
}

for (const [_, player] of useEvent(Players, Players.PlayerAdded)) {
    const result = getHydratePayload(world)
    if (!result.isEmpty) {
        someRemotes.hydratePayload.fire(play, result.payload)
    }
}
```


It is important to note that if the module that contains the syncable components was never required by the client, then the client will never be able to get the syncable components data from the server.
Consider using nested require solutions in this case.

## Behavior

The client will only see the entity if any of it's current components are syncable.
That means that there quite often will be the case when the entity is considered to be `removed` from the client side of view, which will not be the case for the server if this entity has other non-syncable components in it.
