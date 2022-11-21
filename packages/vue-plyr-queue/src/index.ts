import { computed, ComputedRef, readonly, Ref, ref, UnwrapRef } from "vue";
import { createEventHook } from "@mellkam/vue-plyr/utils";
import { usePlyr } from "@mellkam/vue-plyr";
import { Options } from "plyr";

type VideoGeneric = { id: string; videoId: string };

export const usePlyrQueue = <Video extends VideoGeneric>(
	target: Ref<HTMLElement | null | undefined>,
	initialQueue: Video[],
	options: Options = {}
) => {
	const queue = ref(initialQueue) as Ref<Video[]>;
	const currentVideo = computed(() => queue.value[0]) as ComputedRef<
		Video | undefined
	>;
	const queueLength = computed(() => queue.value.length);
	const isQueueActive = computed<boolean>(() => queueLength.value > 0);

	const playVideoEvent = createEventHook<Video>();
	const removeVideoEvent = createEventHook<Video>();
	const videoPauseEvent = createEventHook<Video>();

	const { onPlyrInit, plyr, isPaused, isHidden } = usePlyr(target, options);

	onPlyrInit((p) => {
		p.on("ended", next);

		p.on("pause", () => {
			if (currentVideo.value === undefined) return;
			videoPauseEvent.trigger(currentVideo.value);
		});

		p.on("play", () => {
			if (!currentVideo.value) return;
			playVideoEvent.trigger(currentVideo.value);
		});

		if (isQueueActive.value) {
			setVideo(queue.value[0] as Video, false);
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
			setVideo(videos[0], false);
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

	const setVideo = (video: Video, playImmediately?: boolean) => {
		if (plyr.value === null) {
			return console.error("Cannot set video, because player is null");
		}
		plyr.value.source = {
			type: "video",
			sources: [
				{
					src: video.videoId,
					provider: "youtube",
				},
			],
		};

		playImmediately =
			typeof playImmediately === "undefined"
				? plyr.value.autoplay
				: playImmediately;

		if (playImmediately) {
			return plyr.value.once("ready", () => {
				if (plyr.value === null) {
					return console.error("Cannot play video, because player is null");
				}
				plyr.value.currentTime = 0;
				isPaused.value = false;
			});
		}

		isPaused.value = true;
	};

	const skipCurrentVideo = () => {
		if (!isQueueActive.value) return;

		removeVideoEvent.trigger(queue.value.shift()!);
		const nextVideo = queue.value[0];
		if (nextVideo) return setVideo(nextVideo);

		plyr.value?.stop();
	};

	function next() {
		if (!isQueueActive.value) {
			return plyr.value?.stop();
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
		onPlyrInit,
		plyr,
		isPaused,
		isHidden,
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
