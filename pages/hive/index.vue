<template>
    <div class="flex flex-col items-center justify-center h-screen bg-[#FFF8E5] space-y-4">
        <Icon name="material-symbols:hive-rounded" class="w-16 h-16 text-[#A86523]" aria-label="Hive Icon"/>
        <h1 class="text-2xl text-[#A86523]" style="font-family: 'Nexa'; font-weight: 800">Welcome to HIVE</h1>
        <p class="mt-2 text-sm text-gray-600">Join or create a hive to start collaborating.</p>
        <div class="flex space-x-4 mt-4">
            <NuxtLink 
                to="/hive/create" 
                class="px-4 py-2 
                text-white 
                bg-[#A86523] 
                rounded"
            >
                Create Hive
            </NuxtLink>
            <NuxtLink 
                to="/hive/join" 
                class="px-4 py-2 
                text-white 
                bg-[#A86523] 
                rounded"
            >
                Join Hive
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'hive',
});
</script>