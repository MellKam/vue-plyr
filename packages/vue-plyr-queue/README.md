# vue-plyr-queue

![npm](https://badgen.net/npm/v/@mellkam/vue-plyr-queue)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr-queue)

Vue hook for video/audio queue.

It uses Plyr by [sampotts](https://github.com/sampotts) for the player.

# Instalation

This package has two peer dependencies.

```json
"peerDependencies": {
  "plyr": ">=3.6.3",
  "vue": ">=3.2.0"
},
```

They also need to be installed. Supported versions are listed above.

> It is assumed that vue is already used in your project.

```bash
npm i @mellkam/vue-plyr-queue plyr
yarn add @mellkam/vue-plyr-queue plyr
pnpm add @mellkam/vue-plyr-queue plyr
```

# Get started

```vue
<template>
	<Player ref="player">
		<video />
	</Player>
</template>

<script lang="ts" setup>
import { createQueuePlugin } from "@mellkam/vue-plyr-queue";
import { Player, PlayerInstance, usePlyr } from "@mellkam/vue-plyr";
import { ref } from "vue";

const player = ref<PlayerInstance | null>(null);
const { addPlugin } = usePlyr(player);

addPlugin(
	createQueuePlugin([
		{
			id: "1",
			videoId: "https://www.youtube.com/watch?v=MSq_DCRxOxw",
			sourceType: "youtube",
		},
	]),
);
</script>
```
