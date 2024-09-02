import type { Config } from "@rbxts/jest";

export = identity<Config>({
	testMatch: ["**/*.spec"],
} as const);
