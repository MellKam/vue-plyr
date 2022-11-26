<template>
	<Player ref="player">
		<video />
	</Player>
</template>

<script lang="ts" setup>
import { Player, PlayerInstance, usePlyr } from "@mellkam/vue-plyr";
import { ref } from "vue";

const player = ref<PlayerInstance | null>(null);
const { setVideo, onPlyrInit } = usePlyr(player);

onPlyrInit(() => {
	setVideo({
		src: "https://www.youtube.com/watch?v=MSq_DCRxOxw",
		provider: "youtube",
	});
});
</script>
