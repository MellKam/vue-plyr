import { computed, ComputedRef, readonly, Ref, ref } from "vue";
import { createEventHook } from "@mellkam/vue-plyr/utils";
import { type PlyrPluginData } from "@mellkam/vue-plyr";
import { Provider } from "plyr";

type VideoGeneric = {
	id: string;
	src: string;
	provider: Provider;
};

export const createQueuePlugin = <Video extends VideoGeneric>(
	initialQueue: Video[],
) => {
	return (data: PlyrPluginData) => {
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
				setVideo(queue.value[0]);
			}
		});

		const queueWithoutFirst = computed(() => {
			if (queueLength.value <= 1) {
				return [];
			}

			return [...queue.value].slice(1);
		});

		const addVideo = (...videos: Video[]) => {
			if (queue.value.length === 0) {
				setVideo(videos[0]);
			}
			queue.value.push(...videos);
		};

		const removeVideo = (id: string) => {
			if (queue.value[0].id === id) {
				return;
			}
			queue.value = queue.value.filter((v) => {
				if (v.id !== id) return true;

				removeVideoEvent.trigger(v);
				return false;
			});
		};

		const setVideo = (video: Video) => {
			const isVideoSetted = data.setVideo({
				src: video.src,
				provider: video.provider,
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
			if (nextVideo) return setVideo(nextVideo);

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
			setVideo(queue.value[0]);
		}

		return {
			addVideo,
			removeVideo,
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
