# vue-plyr (DEPRECATED)

![npm](https://badgen.net/npm/v/@mellkam/vue-plyr)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr)

Integration of the Plyr player with Vue framework.

This package was deprecated because it was making unnecessary abstraction and
complicate the developers life. You can use plyr in vue with a few lines of code
as shown below.

```vue
<template>
	<video ref="player" />
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import Plyr from "plyr";
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

onMounted(() => {
  if (!plyr.value) return;

  // use plyr instance
})
</script>
```

# vue-plyr-queue

![npm](https://badgen.net/npm/v/@mellkam/vue-plyr-queue)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr-queue)

Package that makes easy to build video queue with plyr in vue

[Documentation](https://github.com/MellKam/vue-plyr/blob/main/packages/vue-plyr-queue/README.md)
