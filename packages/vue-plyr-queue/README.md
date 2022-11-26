# vue-plyr-queue
![npm](https://badgen.net/npm/v/@mellkam/vue-plyr-queue)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr-queue)

Plugin for [@mellkam/vue-plyr](https://npmjs.com/package/@mellkam/vue-plyr) that makes ease to create video/audio queue with [plyr](https://github.com/sampotts/plyr) player.

# Instalation

This package has three required peer dependencies.

```json
"peerDependencies": {
  "plyr": ">=3.6.3",
  "vue": ">=3.2.0",
	"@mellkam/vue-plyr": "0.2.0"
},
```

Supported versions are listed above.

```bash
npm i @mellkam/vue-plyr-queue
yarn add @mellkam/vue-plyr-queue
pnpm add @mellkam/vue-plyr-queue
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
