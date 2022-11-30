import { computed, ComputedRef, DeepReadonly, readonly, Ref, ref } from "vue";
import { createEventHook, EventHookOn } from "@mellkam/vue-plyr/utils";
import type { Plugin } from "@mellkam/vue-plyr";
import type { Provider } from "plyr";

export interface QueueVideoGeneric {
	id: string;
	/**
	 * The source of the video. Depending on the provider, this can be the url to (youtube|vimeo) video or the path to the file.
	 */
	src: string;
	provider?: Provider;
}

export interface QueuePluginData<Video extends QueueVideoGeneric> {
	addQueueVideo: (...video: Video[]) => void;
	removeQueueVideo: (id: Video["id"]) => void;
	skipCurrentVideo: () => void;
	isQueueActive: Readonly<Ref<boolean>>;
	queueLength: Readonly<Ref<number>>;
	queue: Readonly<Ref<readonly DeepReadonly<Video>[]>>;
	onPlayVideo: EventHookOn<Video>;
	onRemoveVideo: EventHookOn<Video>;
	onPause: EventHookOn<Video>;
	currentVideo: Readonly<Ref<DeepReadonly<Video> | undefined>>;
	queueWithoutFirst: Readonly<Ref<readonly DeepReadonly<Video>[]>>;
}

export type QueuePlugin<Video extends QueueVideoGeneric> = Plugin<
	QueuePluginData<Video>
>;

export const createQueuePlugin = <Video extends QueueVideoGeneric>(
	initialQueue: Video[],
	options: { defaultProvider?: Provider } = {},
): QueuePlugin<Video> => {
	return (data) => {
		const queue = ref(initialQueue) as Ref<Video[]>;
		const currentVideo = computed(() => queue.value[0]) as ComputedRef<
			Video | undefined
		>;
		const queueLength = computed(() => queue.value.length);
		const isQueueActive = computed<boolean>(() => queueLength.value > 0);

		const playVideoEvent = createEventHook<Video>();
		const removeVideoEvent = createEventHook<Video>();
		const videoPauseEvent = createEventHook<Video>();

		data.onPlyrInit((plyr) => {
			plyr.on("ended", next);

			plyr.on("pause", () => {
				if (currentVideo.value === undefined) return;
				videoPauseEvent.trigger(currentVideo.value);
			});

			plyr.on("play", () => {
				if (!currentVideo.value) return;
				playVideoEvent.trigger(currentVideo.value);
			});

			if (isQueueActive.value) {
				setQueueVideo(queue.value[0]);
			}
		});

		const queueWithoutFirst = computed(() => {
			if (queueLength.value <= 1) {
				return [];
			}

			return [...queue.value].slice(1);
		});

		const addQueueVideo = (...videos: Video[]) => {
			if (queue.value.length === 0) {
				setQueueVideo(videos[0]);
			}
			queue.value.push(...videos);
		};

		const removeQueueVideo = (id: string) => {
			if (queue.value[0].id === id) {
				return;
			}

			queue.value = queue.value.filter((v) => {
				if (v.id !== id) return true;

				removeVideoEvent.trigger(v);
				return false;
			});
		};

		const setQueueVideo = (video: Video) => {
			const provider = video.provider || options.defaultProvider;
			if (!provider) {
				return console.warn("Cannot get video provider");
			}

			const isVideoSetted = data.setVideo({
				src: video.src,
				provider,
			});
			if (!isVideoSetted) {
				return console.error("Unable to set video");
			}

			if (data.plyr!.autoplay) {
				return data.plyr!.once("ready", () => {
					if (data.plyr === null) {
						return console.error("Unable to play video");
					}
					data.plyr.currentTime = 0;
					data.isPaused = false;
				});
			}

			data.isPaused = true;
		};

		const skipCurrentVideo = () => {
			if (!isQueueActive.value) return;

			removeVideoEvent.trigger(queue.value.shift()!);
			const nextVideo = queue.value[0];
			if (nextVideo) return setQueueVideo(nextVideo);

			data.plyr?.stop();
		};

		function next() {
			if (!isQueueActive.value) {
				return data.plyr?.stop();
			}

			if (queue.value.length === 1) {
				return removeVideoEvent.trigger(queue.value.pop()!);
			}

			removeVideoEvent.trigger(queue.value.shift()!);
			setQueueVideo(queue.value[0]);
		}

		return {
			addQueueVideo,
			removeQueueVideo,
			skipCurrentVideo,
			isQueueActive: readonly(isQueueActive),
			queueLength: readonly(queueLength),
			queue: readonly(queue),
			onPlayVideo: playVideoEvent.on,
			onRemoveVideo: removeVideoEvent.on,
			onPause: videoPauseEvent.on,
			currentVideo: readonly(currentVideo),
			queueWithoutFirst: readonly(queueWithoutFirst),
		};
	};
};
