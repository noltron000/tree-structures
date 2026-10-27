type Constructor <
	Instance = unknown,
	Arguments extends Array<unknown> = [ ],
> = new (...args: Arguments) => Instance

export type {Constructor}
