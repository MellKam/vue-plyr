<template>
	<Player ref="player">
		<video />
	</Player>
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { Player } from "@mellkam/vue-plyr";
</script>
