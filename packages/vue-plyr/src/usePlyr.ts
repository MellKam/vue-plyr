import { onBeforeUnmount, onMounted, reactive, Ref, ref, watch } from "vue";
import Plyr, { Source } from "plyr";
import { createEventHook, EventHookOn } from "./utils";
import { Player } from "./Player";

export type PlayerInstance = InstanceType<typeof Player>;

export type PlyrPluginData = {
	plyr: Plyr | null;
	onPlyrInit: EventHookOn<Plyr>;
	isHidden: boolean;
	isPaused: boolean;
	addPlugin: <R>(plugin: Plugin<R>) => R;
	setVideo: (video: Source) => boolean;
};

export type Plugin<R> = (data: PlyrPluginData) => R;

export const usePlyr = (
	target: Ref<PlayerInstance | null>,
): {
	plyr: Ref<Plyr | null>;
	onPlyrInit: EventHookOn<Plyr>;
	isPaused: Ref<boolean>;
	isHidden: Ref<boolean>;
	addPlugin: <R>(plugin: Plugin<R>) => R;
	setVideo: (video: Source) => boolean;
} => {
	const plyr: Ref<Plyr | null> = ref(null);
	const initEvent = createEventHook<Plyr>();
	const isPaused = ref(true);
	const isHidden = ref(false);

	onMounted(() => {
		if (!target.value || !target.value.plyr) {
			return console.error(
				`Unable to retrieve a Plyr instance from given target`,
			);
		}

		plyr.value = target.value.plyr;

		isPaused.value = plyr.value.paused;
		plyr.value.on("pause", () => (isPaused.value = true));
		plyr.value.on("play", () => (isPaused.value = false));

		const stopWatchPause = watch(
			() => isPaused.value,
			(isPaused) => {
				if (!plyr.value) return;
				if (isPaused !== plyr.value.paused) {
					isPaused ? plyr.value.pause() : plyr.value.play();
				}
			},
		);

		const stopWatchHidden = watch(
			() => isHidden.value,
			(isHidden) => {
				if (!plyr.value) return;
				const container = plyr.value.elements.container;
				if (!container) return;

				if (isHidden) {
					container.style.display = "none";
				} else {
					container.style.removeProperty("display");
				}
			},
		);

		onBeforeUnmount(() => {
			stopWatchPause();
			stopWatchHidden();
		});

		initEvent.trigger(plyr.value);
	});

	const setVideo = (video: Source): boolean => {
		if (plyr.value === null) return false;

		plyr.value.source = {
			type: "video",
			sources: [video],
		};
		return true;
	};

	const addPlugin = <R>(plugin: Plugin<R>): R => {
		return plugin(pluginData);
	};

	const data = {
		plyr,
		isHidden,
		isPaused,
		onPlyrInit: initEvent.on,
		addPlugin,
		setVideo,
	};
	const pluginData = reactive(data);

	return data;
};
