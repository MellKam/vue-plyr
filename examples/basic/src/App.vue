<template>
	<h1>Hello World</h1>
	<video ref="plyrTarget" />
	<button @click="isPaused = !isPaused">{{ isPaused }}</button>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { usePlyr, usePlyrPause } from "@mellkam/vue-plyr";
import { ref } from "vue";

const plyrTarget = ref<HTMLElement | null>(null);
const plyr = usePlyr(plyrTarget);
const { isPaused } = usePlyrPause(plyr);

console.log(plyr);
</script>
