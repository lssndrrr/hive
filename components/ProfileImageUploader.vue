<template>
    <div
        class="flex justify-center items-center flex-col space-y-4 relative"
        style="padding-bottom: 30px"
    >
        <div class="parent-container">
            <div class="circle-container">
                <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    alt="Profile Picture"
                    class="profile-image"
                />
                <div v-else class="icon-wrapper">
                    <UIcon
                        name="i-heroicons-user"
                        class="w-16 h-16 text-gray-500"
                    />
                </div>
            </div>
            <div class="camera-wrapper">
                <UModal>
                    <UButton
                        color="secondary"
                        variant="solid"
                        class="camera-icon"
                    >
                        <UIcon
                            name="i-heroicons-camera"
                            class="w-4 h-4 text-white"
                        />
                    </UButton>

                    <template #content>
                        <Placeholder
                            class="h-30 flex justify-center items-center"
                        >
                            <div
                                class="flex flex-column gap-4 items-center justify-center"
                            >
                                <UButton
                                    type="submit"
                                    color="primary"
                                    size="xl"
                                    variant="soft"
                                    @click="fileInput?.click()"
                                    style="
                                        font-family: 'Nexa';
                                        font-weight: 800;
                                    "
                                    class="flex justify-center hover:bg-primary text-white"
                                >
                                    Add Image
                                </UButton>
                                <UButton
                                    type="submit"
                                    color="error"
                                    size="xl"
                                    variant="soft"
                                    @click="removeImage"
                                    style="
                                        font-family: 'Nexa';
                                        font-weight: 800;
                                    "
                                    class="flex justify-center hover:bg-error text-white"
                                >
                                    Remove Image
                                </UButton>
                            </div>
                        </Placeholder>
                    </template>
                </UModal>
            </div>
        </div>
        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageChange"
        />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:image'])

const imageUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function handleImageChange(event: Event) {
    const fileInputElement = event.target as HTMLInputElement
    if (fileInputElement?.files?.[0]) {
        const file = fileInputElement.files[0]
        const reader = new FileReader()

        reader.onloadend = () => {
            imageUrl.value = reader.result as string
            emit('update:image', imageUrl.value)
        }

        reader.readAsDataURL(file)
    }
}

function removeImage() {
    imageUrl.value = null
    emit('update:image', null)
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}
</script>

<style scoped>
.parent-container {
    position: relative;
    width: 150px;
    height: 150px;
}

.circle-container {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.camera-wrapper {
    position: absolute;
    bottom: 1rem;
    left: 7rem;
    z-index: 1;
}

.camera-icon {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
