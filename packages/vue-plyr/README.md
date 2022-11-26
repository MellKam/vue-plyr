# vue-plyr
![npm](https://badgen.net/npm/v/@mellkam/vue-plyr)
![license](https://badgen.net/npm/license/@mellkam/vue-plyr)

Integration of the Plyr player with Vue framework.

It uses Plyr by [sampotts](https://github.com/sampotts) for the players.

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

Basic usage with component

```vue
<template>
	<Player>
		<div data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
	</Player>
</template>

<script lang="ts" setup>
import { Player } from "@mellkam/vue-plyr";
</script>
```

Basic usage with component

```vue
<template>
	<Player>
		<div data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>
	</Player>
</template>

<script lang="ts" setup>
import { Player } from "@mellkam/vue-plyr";
</script>
```
