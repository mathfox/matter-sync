import { runCLI, type AggregatedResult } from "@rbxts/jest";
import { ReplicatedStorage } from "@rbxts/services";
//
//const [processServiceExists, ProcessService] = pcall(() => {
//	// @ts-ignore
//	return game.GetService("ProcessService");
//});

runCLI(
	ReplicatedStorage,
	{
		ci: false,
		verbose: false,
	},
	[ReplicatedStorage],
).awaitStatus();
