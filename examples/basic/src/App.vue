<template>
	<video ref="target" />
	<button @click="isPaused = !isPaused">{{ isPaused }}</button>
	<button @click="isHidden = !isHidden">Hide</button>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { usePlyr } from "@mellkam/vue-plyr";
import { ref } from "vue";

const target = ref<HTMLElement>();
const { isHidden, isPaused, onPlyrInit, plyr } = usePlyr(target);

onPlyrInit((plyr) => {
	console.log(plyr);
});
</script>
