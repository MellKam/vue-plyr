# Instalation

This package has two peer dependencies. 

```json
"peerDependencies": {
	"plyr": ">=3.6.3",
	"vue": ">=3.2.0"
},
```

They also need to be installed. Supported versions are listed above.
> It is assumed that vue is already used in your project. 

```bash
npm i @mellkam/vue-plyr plyr
yarn add @mellkam/vue-plyr plyr
pnpm add @mellkam/vue-plyr plyr
```

# Get started

```vue
<template>
	<video ref="target" />
</template>

<script lang="ts" setup>
import "plyr/dist/plyr.css";
import { usePlyr } from "@mellkam/vue-plyr";
import { ref } from "vue";

const plyrTarget = ref<HTMLElement>();
const { plyr } = usePlyr(plyrTarget, { autoplay: false });
</script>
```