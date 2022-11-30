# vue-plyr
![npm](https://badgen.net/npm/v/@mellkam/vue-plyr)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr)

Integration of the Plyr player with Vue framework.

It uses Plyr by [sampotts](https://github.com/sampotts) for the players.

## Instalation

This package has two required peer dependencies.

```json
"peerDependencies": {
	"plyr": ">=3.6.3",
	"vue": ">=3.2.0"
},
```

Supported versions are listed above.

> It is assumed that vue is already used in your project.

```bash
npm i @mellkam/vue-plyr plyr
yarn add @mellkam/vue-plyr plyr
pnpm add @mellkam/vue-plyr plyr
```

## Get started

Basic usage with component

```vue
<template>
	<Player>
		<div data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
	</Player>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { Player } from "@mellkam/vue-plyr";
</script>
```

## Access Plyr instance

You can access the plyr instance through the "plyr" link. But it will only be available when the component will mount.

```vue
<template>
	<Player ref="player">
		<video />
	</Player>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { Player, PlayerInstance, usePlyr } from "@mellkam/vue-plyr";
import { ref, onMounted } from "vue";

const player = ref<PlayerInstance | null>(null);
const { plyr } = usePlyr(player);

onMounted(() => {
	console.log(plyr.value);
});
</script>
```

But for ease of use you can call the `onPlyrInit` event hook. You can pass a callback and get an instance of plyr.

```ts
const player = ref<PlayerInstance | null>(null);
const { onPlyrInit } = usePlyr(player);

onPlyrInit((plyr) => {
	console.log(plyr);
})
```

## Plugins

The Plugin is just a function that gets PlyrData (the same data that `usePlyr` returns).

```ts
const { addPlugin } = usePlyr(player);

const plugin: Plugin<void> = (data) => {
	data.onPlyrInit((plyr) => {
		plyr.once("canplay", () => {
			console.log("Player can play!!!");
		});
	});
}

addPlugin(plugin);
```

You can return the value from the plugin and use it in your components.

```ts
const { addPlugin } = usePlyr(player);

const { isPause } = addPlugin((data) => {
	const isPause = ref(true);

	data.onPlyrInit((plyr) => {
		plyr.once("pause", () => {
			isPause.value = true;
		});

		plyr.once("play", () => {
			isPause.value = false;
		});
	});

	return { isPause };
});
```