// We're storing ledgers as three hashmaps that use uuids as keys: transactions,
// accounts, and counterparties.

import { ref, type Ref, toRaw } from "vue";
import { save_ledger } from "./ledger_storage";
export { load_ledger, load_example_ledger, save_ledger } from './ledger_storage';

// This is the return type of crypto.randomUUID()
export type UUID = `${string}-${string}-${string}-${string}-${string}`;
export type UUIDMap<ValueType> = Map<UUID, ValueType>;


export interface Transaction {
    account_id: UUID;
    counterparty_id: UUID;
    amount: number;
    timestamp: Date;
}

// All accounts start at $0 in order to make their history more traceable
export interface Account {
    name: string;
    description?: string;
    balance: number;
    transactions: UUID[];
    creation_timestamp: Date;
}

export interface Counterparty {
    name: string;
    description?: string;
    transactions: UUID[];
}

export const transactions: Ref<UUIDMap<Transaction>> = ref(new Map());
export const accounts: Ref<UUIDMap<Account>> = ref(new Map());
export const counterparties: Ref<UUIDMap<Counterparty>> = ref(new Map());

export function get_transaction(uuid: UUID): Transaction {
    let transaction = transactions.value.get(uuid);
    if (transaction == undefined) {
        throw `Could not find transaction ${uuid}`;
    }
    return transaction;
}

export function get_account(uuid: UUID): Account {
    let account = accounts.value.get(uuid);
    if (account == undefined) {
        throw `Could not find account ${uuid}`;
    }
    return account;
}

export function get_counterparty(uuid: UUID): Counterparty {
    let counterparty = counterparties.value.get(uuid);
    if (counterparty == undefined) {
        throw `Could not find counterparty ${uuid}`;
    }
    return counterparty;
}


export async function new_transaction(account_id: UUID, counterparty_id: UUID, amount: number, timestamp?: Date): Promise<UUID> {
    let new_uuid = crypto.randomUUID();

    if (!accounts.value.has(account_id)) {
        throw new Error(`Account id ${account_id} does not exist`);
    }
    if (!counterparties.value.has(counterparty_id)) {
        throw new Error(`Counterparty id ${counterparty_id} does not exist`);
    }
    get_account(account_id).transactions.push(new_uuid);
    get_counterparty(counterparty_id).transactions.push(new_uuid);

    transactions.value.set(new_uuid, {
        account_id,
        counterparty_id,
        amount,
        timestamp: timestamp ?? new Date()
    });
    recalc_account_balance(account_id);

    save_ledger();
    return new_uuid;
}

export async function new_account(name: string, description?: string, creation_timestamp?: Date): Promise<UUID> {
    let new_uuid = crypto.randomUUID();
    accounts.value.set(new_uuid, {
        name,
        description,
        balance: 0,
        transactions: [],
        creation_timestamp: creation_timestamp ?? new Date
    });

    save_ledger();
    return new_uuid;
}

export async function new_counterparty(name: string, description?: string): Promise<UUID> {
    let new_uuid = crypto.randomUUID();
    counterparties.value.set(new_uuid, {
        name,
        description,
        transactions: []
    });

    save_ledger();
    return new_uuid;
}

export async function delete_transaction(key: UUID, save: boolean = true) {
    const transaction = get_transaction(key);
    if (transaction == undefined) {
        throw "Could not find transaction";
    }

    const account_transaction_index = get_account(transaction.account_id)?.transactions.indexOf(key);
    if (account_transaction_index == undefined) {
        throw "Could not find account";
    }
    get_account(transaction.account_id)?.transactions.splice(account_transaction_index, 1);
    recalc_account_balance(transaction.account_id);

    const counterparty_transaction_index = get_counterparty(transaction.counterparty_id)?.transactions.indexOf(key);
    if (counterparty_transaction_index == undefined) {
        throw "Could not find counterparty";
    }
    get_counterparty(transaction.counterparty_id)?.transactions.splice(counterparty_transaction_index, 1);

    transactions.value.delete(key);

    if (save) {
        save_ledger();
    }
}

export async function delete_account(key: UUID) {
    const account = get_account(key);
    if (account == undefined) {
        throw "Could not find account";
    }
    // We have to copy the array with Array.from here because if we iterated
    // through account.transactions, then it would all get bungled up as we
    // delete transactions and modify that list.
    await Promise.all(Array.from(account.transactions).map((t) => delete_transaction(t, false)));

    accounts.value.delete(key);

    save_ledger();
}

// export const delete_counterparty = counterparties.value.delete;
export async function delete_counterparty(key: UUID) {
    const counterparty = get_counterparty(key);
    if (counterparty == undefined) {
        throw "Could not find counterparty";
    }

    // We have to copy the array with Array.from here because if we iterated
    // through account.transactions, then it would all get bungled up as we
    // delete transactions and modify that list.
    await Promise.all(Array.from(counterparty.transactions).map((t) => delete_transaction(t, false)));

    counterparties.value.delete(key);

    save_ledger();
}

// This goes through a transaction list and finds the balance of the account
// after making those transactions, assuming it starts at $0
export const calc_balance = (transactions: UUID[]): number =>
    transactions
        .map((uuid) => get_transaction(uuid).amount) // Map uuids to amounts
        .reduce((a, b) => a + b, 0) // Sum amounts

export const recalc_account_balance = (account: UUID) =>
    get_account(account).balance = calc_balance(get_account(account).transactions);
