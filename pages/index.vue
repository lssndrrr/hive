<template>
    <div class="flex min-h-screen items-center justify-center bg-white">
        <AppHeader />
        <div
            class="fixed top-0 right-0 p-8 z-50 flex flex-row items-center space-x-1"
        >
            <NuxtLink to="/login">
                <UButton
                    type="submit"
                    size="xl"
                    variant="ghost"
                    style="font-family: 'Nexa'; font-weight: 800"
                    class="w-33 flex justify-center text-primary hover:bg-secondary hover:text-white"
                >
                    Login
                </UButton>
            </NuxtLink>

            <NuxtLink to="/signup">
                <UButton
                    type="submit"
                    size="xl"
                    variant="ghost"
                    style="font-family: 'Nexa'; font-weight: 800"
                    class="w-33 flex justify-center text-primary hover:bg-secondary hover:text-white"
                >
                    Join
                </UButton>
            </NuxtLink>
        </div>
        <div
            class="w-full max-w-5xl p-10 space-y-10 text-black flex flex-col items-center"
        >
            <h1
                class="text-5xl text-primary"
                style="font-family: 'Nexa'; font-weight: 800"
            >
                Your Hive for Getting Things Done
            </h1>
            <p
                class="text-neutral text-sm text-center text-primary"
                style="font-family: 'Nexa'; font-weight: 200"
            >
                Get Your Team BUZZing - and BEE Productive, Together,
            </p>
            <NuxtLink to="/signup">
                <UButton
                    type="submit"
                    color="secondary"
                    size="xl"
                    trailing-icon="i-lucide-arrow-right"
                    style="font-family: 'Nexa'; font-weight: 800"
                    class="flex justify-center hover:bg-primary text-white"
                >
                    Get Started for Free
                </UButton>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const show = ref(false)
const password = ref('')

const login = async () => {
    console.log('Logging in with:', email.value, password.value)
}
</script>
