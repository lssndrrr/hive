<template>
  <div class="flex flex-col items-center space-y-4 justify-center h-screen bg-[#FFF8E5]">

    <div class="flex flex-col items-center space-y-2 justify-center w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <Icon
        name="material-symbols:hive-rounded"
        class="w-8 h-8 text-[#A86523]"
        aria-label="Hive Icon"
      />

      <h1 
        class="text-2xl text-center text-[#A86523]"
        style="font-family: 'Nexa'; font-weight: 800"
      >
        Join a Hive
      </h1>
      <p class="mt-2 text-sm text-gray-600">BEE a part of something greater!</p>
      
        <UInput
        placeholder="Paste hive invite link here"
        class="w-full p-2 text-[#A86523]"
        :ui="{
          base: 'bg-white, text-[#A86523]',
          trailing: 'pe-1',
        }"
        required
        variant="subtle"
        color="neutral"
        />

        <UButton
          label="Join"
          class="w-full px-4 py-2 justify-center text-white bg-[#A86523] cursor-pointer"
          style="font-family: 'Nexa'; font-weight: 800"
        />
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
  definePageMeta({
    layout: 'hive'
  });
</script>