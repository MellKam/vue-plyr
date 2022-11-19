import { Ref, ref, watch, onBeforeUnmount, getCurrentInstance } from "vue";
import type Plyr from "plyr";

export const usePlyrPause = (
	plyr: Ref<Plyr | null>,
	defaultValue: boolean = true
) => {
	const isPaused = ref(defaultValue);
	const componentInstance = getCurrentInstance();

	const initPause = (plyr: Plyr) => {
		isPaused.value ? plyr.pause() : plyr.play();
		const stopWatchPause = watch(
			() => isPaused.value,
			(isPaused) => {
				if (isPaused !== plyr.paused) {
					isPaused ? plyr.pause() : plyr.play();
				}
			}
		);
		if (componentInstance) {
			onBeforeUnmount(stopWatchPause, componentInstance);
		} else {
			console.warn("Cannot stop watch listener on pause");
		}

		plyr.on("pause", () => {
			isPaused.value = true;
		});
	};

	if (plyr.value === null) {
		const stopWatchPlyr = watch(
			() => plyr.value,
			(plyr) => {
				if (plyr === null) return;

				stopWatchPlyr();
				initPause(plyr);
			}
		);
	} else {
		initPause(plyr.value);
	}

	return { isPaused };
};
