<script setup lang="ts">
const emits = defineEmits(["confirm"]);

const feedback = (val: boolean) => {
	emits("confirm", val);
};
</script>

<template>
	<div
		class="bg-neutral-950 z-50 fixed top-0 left-0 right-0 bottom-0 bg-opacity-50">
		<dialog class="top-20 p-5 rounded bg-slate-300" open>
			<h4>You sure you want delete it?</h4>
			<div class="text-white flex justify-around pt-5">
				<button @click="feedback(false)" class="px-5 py-2 infoBtn">No</button>
				<button @click="feedback(true)" class="px-5 py-2 deleteBtn">Yes</button>
			</div>
		</dialog>
	</div>
</template>
