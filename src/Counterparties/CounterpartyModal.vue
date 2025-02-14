<script setup lang="ts">
import { Ref, ref, toRaw } from 'vue';
import Modal from '../Modal.vue';
import { Counterparty, counterparties, new_counterparty, UUID, save_ledger, get_counterparty } from '../account_management/ledger_state';
import Error from '../Error.vue';

const props = defineProps<{
    buttonIcon: string,
    counterpartyUuid?: UUID
}>();

const active = defineModel<boolean>('active', { default: false });

let counterparty: Counterparty | undefined = undefined;
if (props.counterpartyUuid != undefined) {
    counterparty = get_counterparty(props.counterpartyUuid);
}

let name: Ref<string> = ref(counterparty?.name ?? "");
let description: Ref<string> = ref(counterparty?.description ?? "");

const error_message = ref("");

// This function exits the modal and not the add button because if something
// goes wrong, I don't want to exit the modal
function finish() {
    if (name.value == "") {
        error_message.value = "Missing counterparty name";
        return;
    }

    // Check if this modal is supposed to edit a counterparty or make a new one
    if (props.counterpartyUuid == undefined) {
        new_counterparty(name.value, description.value);
        // Clear the fields
        name.value = "";
        description.value = "";
    } else if (counterparty != undefined) {
        // If the description field is blank, we want to store it as undefined
        // in the Counterparty object
        const proc_description = description.value.trim() == "" ?
            undefined : description.value.trim();
        counterparties.value.set(props.counterpartyUuid, {
            name: name.value.trim(),
            description: proc_description,
            transactions: toRaw(counterparty.transactions),
        });
        save_ledger();
    } else {
        error_message.value = "Could not find counterparty to edit";
    }

    active.value = false;
}
</script>

<template>
    <span class="material-symbols-outlined clickable" @click="active = true">
        {{ buttonIcon }}
    </span>
    <Modal :active="active">
        <span class="input-label">Name:</span>
        <input type="text" v-model="name" />
        <br>

        <span class="input-label">Description:</span>
        <input type="text" v-model="description" />

        <Error v-if="error_message != ''">{{ error_message }}</Error>
        <div class="spacing" v-if="error_message == ''"></div>
        <div class="page-top-bar">
            <span class="clickable" @click="finish()">
                {{ counterpartyUuid == undefined ? "Add" : "Save" }}
            </span>
            <span class="clickable" @click="active = false">
                Cancel
            </span>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
span:not(.material-symbols-outlined) {
    @extend .information-header;
    line-height: 200%;
}

input {
    @extend .information;
    background-color: var(--input-background);
    width: 60%;
    border: unset;
    font-size: inherit;

    &:focus-visible {
        outline: unset;
    }
}

span.clickable:not(.material-symbols-outlined) {
    font-size: 1.25em;
}

.input-label {
    margin-inline-end: 0.5em;
}

.spacing {
    height: 1em;
}
</style>
