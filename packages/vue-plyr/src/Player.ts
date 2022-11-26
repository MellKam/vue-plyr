import { type Options, default as Plyr } from "plyr";
import { defineComponent, type PropType } from "vue";

import "plyr/dist/plyr.css";

export const Player = defineComponent({
	props: {
		optinos: { type: Object as PropType<Options>, default: () => ({}) },
	},
	data() {
		return {
			plyr: null as Plyr | null,
		};
	},
	expose: ["plyr"],
	mounted() {
		if (!this.$el) {
			return console.error(
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				`Cannot create Plyr instance, because default slot is "${this.$el}"`,
			);
		}
		this.plyr = new Plyr(this.$el as HTMLElement, this.$props.optinos);
	},
	beforeUnmount() {
		try {
			if (this.plyr !== null) this.plyr.destroy();
		} catch (e) {
			console.error(e);
		}
	},
	render() {
		const slots = this.$slots.default;
		return typeof slots === "function" ? slots()[0] : slots;
	},
});
