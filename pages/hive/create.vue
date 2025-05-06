<template>
  <div class="flex flex-col items-center justify-center h-screen bg-[#FFF8E5]">

    <div class="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <Icon
        name="material-symbols:hive-rounded"
        class="w-8 h-8 text-[#A86523]"
        aria-label="Hive Icon"
      />
      <h1 
        class="text-2xl text-center text-[#A86523]"
        style="font-family: 'Nexa'; font-weight: 800"
      >Create a Hive</h1>
      <p class="mt-2 text-sm text-gray-600">Create a new hive to start collaborating.</p>
      
      <form class="mt-4 space-y-4" @submit.prevent="createHive">
        <UInput
        v-model="hiveName"
        placeholder="Hive Name"
        class="w-full p-2 text-[#A86523]"
        :ui="{
          base: 'bg-white, text-[#A86523]',
          trailing: 'pe-1',
        }"
        required
        variant="subtle"
        color="neutral"
        />

        <UTextarea
          v-model="hiveDescription"
          placeholder="Enter Hive Description (optional)"
          class="w-full p-2 rounded focus:outline-none"
          :ui="{
            base: 'bg-white text-[#A86523]',
            trailing: 'pe-1',
          }"
          variant="subtle"
          required
          autoresize
        />
        <UButton
          type="submit"
          label="Create"
          class="w-full px-4 py-2 justify-center text-white bg-[#A86523]"
          style="font-family: 'Nexa'; font-weight: 800"
        />
      </form>
      <NuxtLink
        to="/hive"
        class="w-full text-center text-xs px-4 py-2 text-[#A86523] cursor-pointer"
      > 
        Go Back
      </NuxtLink>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '#imports';
import { useHiveStore } from '@/stores/hive';

definePageMeta({
  layout: 'hive'
});

const hiveName = ref('');
const hiveDescription = ref('');
const router = useRouter();
const toast = useToast();
const hiveStore = useHiveStore();

async function createHive() {
  const payload = {
      name: hiveName.value,
      description: hiveDescription.value,
  };
  const newHive = await hiveStore.createHive(payload); // Call the store action

  if (newHive) {
      toast.add({ title: 'Success', description: `Hive "${newHive.name}" created!`, color: 'success' });
      hiveName.value = '';
      hiveDescription.value = '';
      // Navigate after successful creation
      router.push(`/hive/${newHive.id}`);
  } else {
      // Error occurred, use the error message from the store
      toast.add({ title: 'Creation Failed', description: hiveStore.error || 'Failed to create hive.', color: 'error' });
  }
}

</script>