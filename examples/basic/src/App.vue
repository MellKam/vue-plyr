<template>
	<h1>Hello World</h1>
	<video ref="plyrTarget" />
	<button @click="isPaused = !isPaused">{{ isPaused }}</button>
	<button @click="isHidden = !isHidden">Hide</button>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { usePlyr } from "@mellkam/vue-plyr";
import { ref } from "vue";

const plyrTarget = ref<HTMLElement>();
const { plyr, onPlyrInit, isPaused, isHidden } = usePlyr(plyrTarget);

onPlyrInit(() => {
	console.log(plyr.value);
});
</script>
