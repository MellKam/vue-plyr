<template>
	<video ref="target" />
	{{ JSON.stringify(queue) }}
	<button @click="skipCurrentVideo">Skip</button>
	<button @click="isPaused = !isPaused">{{ isPaused }}</button>
	<button @click="isHidden = !isHidden">Hide</button>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { usePlyrQueue } from "@mellkam/vue-plyr-queue";
import { ref } from "vue";

const target = ref<HTMLElement>();
const { isPaused, isHidden, onPlyrInit, queue, skipCurrentVideo } =
	usePlyrQueue(
		target,
		[
			{ id: "1", videoId: "https://www.youtube.com/watch?v=MSq_DCRxOxw" },
			{ id: "2", videoId: "https://www.youtube.com/watch?v=MSq_DCRxOxw" },
			{ id: "3", videoId: "https://www.youtube.com/watch?v=MSq_DCRxOxw" },
		],
		{}
	);

onPlyrInit((plyr) => {
	console.log(plyr);
});
</script>
