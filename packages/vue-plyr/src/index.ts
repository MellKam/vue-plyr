import { onBeforeUnmount, onMounted, Ref, ref, watch } from "vue";
import Plyr, { Options } from "plyr";
import { createEventHook, EventHookOn } from "./utils.js";

export const usePlyr = (
	target: Ref<HTMLElement | null | undefined>,
	options: Options = {}
): {
	plyr: Ref<Plyr | null>;
	onPlyrInit: EventHookOn<Plyr>;
	isPaused: Ref<boolean>;
	isHidden: Ref<boolean>;
} => {
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

		const stopWatchHidden = watch(
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
		
		onBeforeUnmount(() => {
			stopWatchPause();
			stopWatchHidden();
		});

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

	return {
		plyr: plyrInstance,
		onPlyrInit: initEvent.on,
		isPaused,
		isHidden,
	};
};
