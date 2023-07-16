# vue-plyr-queue

![npm](https://badgen.net/npm/v/@mellkam/vue-plyr-queue)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr-queue)

Package that makes easy to build video queue with plyr in vue

# Instalation

This package has three required peer dependencies.

```json
"peerDependencies": {
  "plyr": ">=3.6.3",
  "vue": ">=3.2.0",
},
```

```bash
npm i @mellkam/vue-plyr-queue
```

# Get started

```vue
<template>
	<video ref="player" />
	<ul>
		<li v-if="currentVideo">Current: {{ currentVideo.src }}</li>
		<li v-for="video in queue">
			{{ video.src }}
			<button @click="() => removeVideo(video.id)">Remove</button>
		</li>
	</ul>
	<button @click="nextVideo">Next</button>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import Plyr from "plyr";
import { useVideoQueue } from "@mellkam/vue-plyr-queue";
import { computed, onUnmounted, ref } from "vue";

const player = ref<HTMLVideoElement | null>(null);

const plyr = computed(() => {
	if (!player.value) return null;

	return new Plyr(player.value, { autoplay: true });
});

onUnmounted(() => {
	if (!plyr.value) return;

	try {
		plyr.value.destroy();
	} catch (error) {
		console.error(error);
	}
});

const { currentVideo, queue, nextVideo, removeVideo, addVideo } = useVideoQueue(
	{
		plyr,
		initialQueue: [
			{ id: "1", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
			{ id: "2", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
			{ id: "3", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
		],
		defaultProvider: "youtube"
	}
);
</script>
```
