import { onBeforeUnmount, onMounted, Ref, ref, watch } from "vue";
import { Options, default as Plyr } from "plyr";
import { createEventHook } from "./utils.js";

export const usePlyr = (
	target: Ref<HTMLElement | null | undefined>,
	options: Options = {}
) => {
	const plyrInstance = ref<Plyr | null>(null);
	const initEvent = createEventHook<Plyr>();
	const isPaused = ref(true);
	const isHidden = ref(false);

	onMounted(() => {
		if (!target.value) {
			return console.error(
				`Cannot create Plyr instance, because target is "${target.value}"`
			);
		}
		const plyr = new Plyr(target.value, options);
		plyrInstance.value = plyr;

		isPaused.value = plyr.paused;
		plyr.on("pause", () => (isPaused.value = true));
		plyr.on("play", () => (isPaused.value = false));

		const stopWatchPause = watch(
			() => isPaused.value,
			(isPaused) => {
				if (isPaused !== plyr.paused) {
					isPaused ? plyr.pause() : plyr.play();
				}
			}
		);
		onBeforeUnmount(stopWatchPause);

		initEvent.trigger(plyr);
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

	watch(
		() => isHidden.value,
		(isHidden) => {
			if (!plyrInstance.value) return;
			const container = plyrInstance.value.elements.container;
			if (!container) return;

			if (isHidden) {
				container.style.display = "none";
			} else {
				container.style.removeProperty("display");
			}
		}
	);

	return {
		plyr: plyrInstance,
		onPlyrInit: initEvent.on,
		isPaused,
		isHidden,
	};
};
