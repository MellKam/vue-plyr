import {
	computed,
	ComputedRef,
	onMounted,
	readonly,
	Ref,
	ref,
	toRef
} from "vue";
import type { Provider, default as Plyr, PreviewThumbnailsOptions } from "plyr";

export type QueueVideoBase = {
	id: string;
	/**
	 * The source of the video. Depending on the provider, this can be the url to (youtube|vimeo) video or the path to the file.
	 */
	src: string;
	provider?: Provider;
	size?: number;
	/**
	 * Title of the new media. Used for the aria-label attribute on the play button, and outer container. YouTube and Vimeo are populated automatically.
	 */
	title?: string;
	/**
	 * The MIME type of the media file (if HTML5).
	 */
	type?: string;
	/**
	 * The URL for the poster image (HTML5 video only).
	 */
	poster?: string;
	/**
	 * Enable or disable preview thumbnails for current source
	 */
	previewThumbnails?: PreviewThumbnailsOptions;
};

export const useVideoQueue = <T_QueueVideo extends QueueVideoBase>({
	plyr,
	initialQueue = [],
	defaultProvider = "html5",
	immediate = true,
	onNextVideo,
	onRemoveVideo
}: {
	plyr:
		| ComputedRef<Plyr | null>
		| ComputedRef<Plyr>
		| Ref<Plyr | null>
		| Ref<Plyr>
		| Plyr;
	initialQueue?: T_QueueVideo[];
	/**
	 * @default "html5"
	 */
	defaultProvider?: Provider;
	/**
	 * If initialsQueue was not empty and immediate is true, then `nextVideo()` will be called.
	 * This will automatically set the currentVideo and plyr source to first video in initialQueue.
	 * Otherwise you need to manually call `nextVideo()` or `addVideo()`.
	 *
	 * @default true
	 */
	immediate?: boolean;
	onNextVideo?: (
		nextVideo: T_QueueVideo,
		previousVideo: T_QueueVideo | null
	) => void;
	onRemoveVideo?: (removedVideo: T_QueueVideo) => void;
}) => {
	const _plyr = toRef(plyr);
	const queue = ref([...initialQueue]) as Ref<T_QueueVideo[]>;
	const currentVideo = ref(null) as Ref<T_QueueVideo | null>;
	const isQueueEmpty = computed(
		() => currentVideo.value === null && queue.value.length === 0
	);

	const setPlyrVideo = (video: T_QueueVideo) => {
		if (!_plyr.value) {
			console.error("Unable to set video because the plyr instance is null.");
			return;
		}

		_plyr.value.source = {
			type: "video",
			sources: [
				{
					src: video.src,
					provider: video.provider || defaultProvider,
					size: video.size,
					type: video.type
				}
			],
			title: video.title,
			poster: video.poster,
			previewThumbnails: video.previewThumbnails
		};

		if (_plyr.value.autoplay) {
			_plyr.value.once("ready", () => {
				if (_plyr.value === null) {
					return console.error(
						"Unable to play video because the plyr instance is null."
					);
				}
				_plyr.value.currentTime = 0;
				return _plyr.value.play();
			});
		} else {
			_plyr.value.pause();
		}
	};

	const nextVideo = () => {
		if (queue.value.length === 0) {
			currentVideo.value = null;
			if (_plyr.value) {
				_plyr.value.source = {
					type: "video",
					sources: []
				};
				_plyr.value.stop();
			}
			return;
		}

		const nextVideo = queue.value.shift() as T_QueueVideo;
		onNextVideo && onNextVideo(nextVideo, currentVideo.value);
		if (currentVideo.value) {
			onRemoveVideo && onRemoveVideo(currentVideo.value);
		}
		currentVideo.value = nextVideo;

		setPlyrVideo(nextVideo);
	};

	const addVideos = (...videos: T_QueueVideo[]) => {
		queue.value.push(...videos);
		if (!currentVideo.value) nextVideo();
	};

	const removeVideo = (id: string) => {
		if (currentVideo.value?.id === id) nextVideo();

		queue.value = queue.value.filter((v) => {
			if (v.id !== id) return true;
			onRemoveVideo && onRemoveVideo(v);
			return false;
		});
	};

	onMounted(() => {
		if (!_plyr.value) return;

		_plyr.value.on("ended", nextVideo);

		if (immediate && queue.value.length !== 0) nextVideo();
	});

	return {
		queue: readonly(queue),
		currentVideo: readonly(currentVideo),
		isQueueEmpty,
		nextVideo,
		addVideos,
		addVideo: (video: T_QueueVideo) => addVideos(video),
		removeVideo
	};
};
