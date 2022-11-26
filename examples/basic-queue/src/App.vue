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
