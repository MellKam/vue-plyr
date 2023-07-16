<template>
	<video ref="player" />
	<ul>
		<li v-if="currentVideo">Current: {{ currentVideo.src }}</li>
		<li v-for="video in queue">
			{{ video.src }}
			<button @click="() => removeVideo(video.id)">Remove</button>
		</li>
	</ul>
	<input v-model="videoSrc" />
	<button @click="() => addVideo({ id: (++maxId).toString(), src: videoSrc })">
		Add video
	</button>
	<button @click="nextVideo">Next</button>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import Plyr from "plyr";
import { useVideoQueue } from "@mellkam/vue-plyr-queue";
import { computed, onUnmounted, ref } from "vue";

const player = ref<HTMLVideoElement | null>(null);
const videoSrc = ref("");
const maxId = ref(3);

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
