<template>
	<Player ref="player">
		<video />
	</Player>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { createQueuePlugin } from "@mellkam/vue-plyr-queue";
import { Player, PlayerInstance, usePlyr } from "@mellkam/vue-plyr";
import { ref } from "vue";

const player = ref<PlayerInstance | null>(null);
const { addPlugin } = usePlyr(player);
addPlugin(
	createQueuePlugin(
		[
			{
				id: "1",
				src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			},
		],
		{ defaultProvider: "youtube" },
	),
);
</script>
