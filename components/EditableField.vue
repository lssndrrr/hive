<template>
    <div
        class="w-[600px] max-w-full flex items-center justify-between p-4 bg-info rounded-xl shadow"
    >
        <label class="text-base">{{ label }}</label>

        <div
            v-if="!isEditing"
            class="flex items-center gap-2"
            style="font-weight: 200"
        >
            <span>{{ modelValue }}</span>
            <UIcon
                name="i-heroicons-pencil"
                class="w-5 h-5 cursor-pointer text-primary hover:text-secondary"
                @click="startEditing"
            />
        </div>

        <div v-else class="flex items-center gap-2" style="font-weight: 200">
            <UInput
                :type="inputType"
                v-model="editableValue"
                size="xl"
                variant="none"
                inputClass="bg-white"
                :style="{ color: 'var(--ui-primary)' }"
                :ui="{ base: 'bg-info' }"
            />
            <UButton
                icon="i-heroicons-check"
                size="sm"
                color="secondary"
                variant="solid"
                @click="save"
            />
            <UButton
                icon="i-heroicons-x-mark"
                size="sm"
                color="error"
                variant="solid"
                @click="cancel"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
const props = defineProps<{
    label: string
    type?: string
    modelValue: string
    showEyeIcon?: boolean
}>()

// Emit
const emit = defineEmits(['update:modelValue', 'toggle-password'])

// Local state
const isEditing = ref(false)
const editableValue = ref(props.modelValue)
const inputType = ref(props.type || 'text')

// Keep editableValue in sync if parent value changes
watch(
    () => props.modelValue,
    (newVal) => {
        editableValue.value = newVal
    }
)

// Actions
function startEditing() {
    isEditing.value = true
}

function cancel() {
    editableValue.value = props.modelValue
    isEditing.value = false
}

function save() {
    emit('update:modelValue', editableValue.value)
    isEditing.value = false
}
</script>
