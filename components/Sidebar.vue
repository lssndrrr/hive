<template>
    <aside
        class="w-16 h-screen bg-[#A86523] px-4 fixed top-0 left-0 flex flex-col items-center justify-between"
    >
        <div class="flex justify-center items-center m-4 w-8 h-8">
            <NuxtLink
                :to="`/${userStore.user?.username}/settings`"
                aria-label="User Settings"
            >
                <UAvatar
                    src="https://avatars.githubusercontent.com/u/739984?v=4"
                    alt="User Avatar"
                    size="lg"
                />
            </NuxtLink>
        </div>

        <nav class="flex flex-col justify-between h-full mb-4">
            <ul class="space-y-2">
                <li class="flex justify-center">
                    <NuxtLink
                        :to="`/${userStore.user?.username}`"
                        aria-label="Home"
                    >
                        <Icon
                            name="material-symbols:home-rounded"
                            class="w-8 h-8"
                        />
                    </NuxtLink>
                </li>
                <li class="flex justify-center">
                    <NuxtLink to="/hive" aria-label="Hives">
                        <Icon
                            name="material-symbols:hive-rounded"
                            class="w-8 h-8"
                        />
                    </NuxtLink>
                </li>
            </ul>

            <li class="flex justify-center">
                <button @click="logout" aria-label="Logout">
                    <Icon
                        name="heroicons:arrow-left-on-rectangle"
                        class="w-8 h-8"
                    />
                </button>
            </li>
        </nav>
    </aside>
</template>

<style scoped>
a {
    /* Using 'a' as NuxtLink renders an anchor tag */
    color: #ffffff; /* Default icon color (white) - inherited by SVG */
    display: inline-flex; /* Use inline-flex for links within list items */
    justify-content: center;
    align-items: center;
    padding: 8px; /* Add some padding for easier clicking */
    border-radius: 8px; /* Rounded corners for hover/active state */
    transition: background-color 0.3s ease; /* Smooth background transition on hover */
}

/* Style for the SVG icon rendered by the Icon component */
/* Applied directly to the link (a) now, as Icon is the only child */
a :deep(svg) {
    /* Use :deep to target SVG inside Icon component */
    width: 32px; /* 32px - Adjust size as needed */
    height: 32px; /* 32px - Adjust size as needed */
    color: currentColor; /* Inherit color from parent link (<a>) */
    transition: color 0.3s ease; /* Add transition for smooth color change */
}

/* Hover state for links */
a:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Subtle background on hover */
}

a:hover :deep(svg) {
    color: #fcefcb; /* Slightly lighter color on hover */
}

/* Active link state */
/* NuxtLink adds 'router-link-exact-active' for the precisely active route */
/* a.router-link-exact-active { */
/* Optional: Add background to active link */
/* background-color: rgba(233, 163, 25, 0.2); */
/* } */

a.router-link-exact-active :deep(svg) {
    color: #e9a319; /* Active icon color */
}
</style>

<script setup lang="ts">
const userStore = useUserStore()
const toast = useToast()
const router = useRouter()

const logout = async () => {
    const res = await userStore.logout()

    if (res.success) {
        toast.add({
            description: res.message,
            class: '!bg-white !text-green-600',
            color: 'success',
        })
        // router.push('/login')
    } else {
        toast.add({
            description: res.message,
            class: '!bg-white !text-red-600',
            color: 'error',
        })
    }
}
</script>
