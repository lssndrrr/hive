<template>
    <div class="flex min-h-screen items-center justify-center">
        <AppHeader />
        <div
            class="w-full max-w-sm p-10 bg-white rounded-2xl shadow-lg space-y-10 text-black"
        >
            <h1
                class="text-5xl text-primary"
                style="font-family: 'Nexa'; font-weight: 800"
            >
                Signup
            </h1>
            <form @submit.prevent="signup" class="flex flex-col space-y-2">
                <div class="flex flex-col space-y-1">
                    <label
                        for="firstName"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                    >
                        First Name
                    </label>
                    <UInput
                        id="firstName"
                        v-model="form.first_name"
                        type="text"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :ui="{
                            base: 'bg-white',
                        }"
                    />
                </div>
                <div class="flex flex-col space-y-1">
                    <label
                        for="lastName"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                    >
                        Last Name
                    </label>
                    <UInput
                        id="lastName"
                        v-model="form.last_name"
                        type="text"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :ui="{
                            base: 'bg-white',
                        }"
                    />
                </div>
                <div class="flex flex-col space-y-1">
                    <label
                        for="username"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                    >
                        Username
                    </label>
                    <UInput
                        id="username"
                        v-model="form.username"
                        type="text"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :ui="{
                            base: 'bg-white',
                        }"
                    />
                </div>
                <div class="flex flex-col space-y-1">
                    <label
                        for="email"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                    >
                        Email
                    </label>
                    <UInput
                        id="email"
                        v-model="form.email"
                        type="email"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :ui="{
                            base: 'bg-white',
                        }"
                    />
                </div>
                <div class="flex flex-col space-y-1">
                    <label
                        for="password"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                        >Password</label
                    >
                    <UInput
                        id="password"
                        v-model="form.password"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :type="show ? 'text' : 'password'"
                        :ui="{
                            base: 'bg-white',
                            trailing: 'pe-1',
                        }"
                    >
                        <template #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                :icon="
                                    show ? 'i-lucide-eye-off' : 'i-lucide-eye'
                                "
                                :aria-label="
                                    show ? 'Hide password' : 'Show password'
                                "
                                :aria-pressed="show"
                                aria-controls="password"
                                @click="show = !show"
                            />
                        </template>
                    </UInput>
                </div>
                <div class="flex flex-col space-y-1">
                    <label
                        for="confirm-password"
                        class="text-neutral"
                        style="font-family: 'Nexa'; font-weight: 200"
                        >Re-type Password</label
                    >
                    <UInput
                        id="confirm-password"
                        v-model="form.confirm_password"
                        variant="outline"
                        inputClass="bg-white text-black placeholder:text-gray-500"
                        :style="{ color: 'black' }"
                        :type="show ? 'text' : 'password'"
                        :ui="{
                            base: 'bg-white',
                            trailing: 'pe-1',
                        }"
                    >
                        <template #trailing>
                            <UButton
                                color="neutral"
                                variant="link"
                                size="sm"
                                :icon="
                                    show ? 'i-lucide-eye-off' : 'i-lucide-eye'
                                "
                                :aria-label="
                                    show ? 'Hide password' : 'Show password'
                                "
                                :aria-pressed="show"
                                aria-controls="password"
                                @click="show = !show"
                            />
                        </template>
                    </UInput>
                </div>

                <UButton
                    type="submit"
                    color="secondary"
                    size="xl"
                    style="font-family: 'Nexa'; font-weight: 800"
                    class="w-full flex justify-center hover:bg-primary text-white"
                >
                    SIGN UP
                </UButton>
                <p
                    class="text-neutral text-sm text-center"
                    style="font-family: 'Nexa'; font-weight: 200"
                >
                    Already have an account?
                    <NuxtLink
                        to="/login"
                        class="text-primary underline hover:text-secondary"
                    >
                        Log in
                    </NuxtLink>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RegisterPayload } from '~/interfaces/auth'

const userStore = useUserStore()
const router = useRouter()

const form = ref<RegisterPayload & { confirm_password: string }>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
})

const show = ref(false)

const signup = async () => {
    if (form.value?.password !== form.value?.confirm_password) {
        alert('Passwords do not match!')
        return
    }
    try {
        if (form.value) {
            await userStore.register(form.value)
            alert('Sign up successful!')
            router.push('/login')
        }
    } catch (err: any) {
        alert('Sign up failed. Please try again.')
        console.log(err)
    }
}
</script>
