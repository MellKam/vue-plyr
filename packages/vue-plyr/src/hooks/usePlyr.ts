import { onBeforeUnmount, onMounted, Ref, ref } from "vue";
import Plyr, { Options } from "plyr";

export const usePlyr = (
	target: Ref<HTMLElement | null>,
	options: Options = {}
) => {
	const plyrInstance = ref<Plyr | null>(null);

	onMounted(() => {
		if (!target.value) {
			return console.error("Cannot create Plyr because target in null");
		}
		plyrInstance.value = new Plyr(target.value, options);
	});

	onBeforeUnmount(() => {
		try {
			if (plyrInstance.value === null) {
				return console.warn("Cannot find Plyr player to destroy it");
			}
			plyrInstance.value.destroy();
		} catch (e) {
			console.error("Cannot destroy Plyr player");
		}
	});

	return plyrInstance;
};
