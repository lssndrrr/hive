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
const toast = useToast()

const signup = async () => {
    try {
        if (form.value) {
            if (form.value?.password !== form.value?.confirm_password) {
                toast.add({
                    description: 'Passwords do not match.',
                    class: '!bg-white !text-red-600',
                    color: 'error',
                })
                return
            }
            const res = await userStore.register(form.value)

            if (res.success) {
                toast.add({
                    description: res.message,
                    class: '!bg-white !text-green-600',
                    color: 'success',
                })
                router.push('/login')
            } else {
                const error_msg =
                    res.error?.detail ??
                    Object.values(res.error || {})
                        .flat()
                        .join('\n') ??
                    'An unknown error occurred.'

                toast.add({
                    description: `${res.message}\n${error_msg}`,
                    class: '!bg-white !text-red-600',
                    color: 'error',
                })
            }
        }
    } catch (err: any) {
        console.error('Unexpected error during signup:', err)

        if (err instanceof Error) {
            alert(err.message)
        } else {
            alert('Something went wrong. Please try again.')
        }
    }
}
</script>
