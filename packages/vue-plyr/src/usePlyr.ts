import {
	onBeforeUnmount,
	onMounted,
	reactive,
	Ref,
	ref,
	watch,
	UnwrapRef,
} from "vue";
import Plyr, { Source } from "plyr";
import { createEventHook, EventHookOn } from "./utils";
import { Player } from "./Player";

/**
 * Return type of the Player component
 */
export type PlayerInstance = InstanceType<typeof Player>;

export type PlyrData = {
	plyr: Ref<Plyr | null>;
	/**
	 * Called when plyr instance has been created and player component initialized.
	 */
	onPlyrInit: EventHookOn<Plyr>;
	/**
	 * If setted to true, then player will be hidden with:
	 * `displyr: "none"`
	 */
	isHidden: Ref<boolean>;
	/**
	 * Just mapping for the pause event.
	 * You can toggle it to play or pause video.
	 * Uses `plyr.play()` and `plyr.pause()` under the hood.
	 */
	isPaused: Ref<boolean>;
	/**
	 * The function that provides data to the plugin and passes the data returned by the plugin
	 */
	addPlugin: <R>(plugin: Plugin<R>) => R;
	/**
	 * Set current player video
	 * @returns false if it cannot set the video, true otherwise
	 */
	setVideo: (video: Source) => boolean;
};

/**
 * Data that the plugin receives during initialization
 */
export type PlyrPluginData = UnwrapRef<PlyrData>;

/**
 * Vue plyr plugin function type
 */
export type Plugin<R> = (data: PlyrPluginData) => R;

export const usePlyr = (target: Ref<PlayerInstance | null>): PlyrData => {
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

		// Initialize pause event listeners
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

	const data: PlyrData = {
		plyr,
		isHidden,
		isPaused,
		onPlyrInit: initEvent.on,
		addPlugin,
		setVideo,
	};
	const pluginData: PlyrPluginData = reactive(data);

	return data;
};
