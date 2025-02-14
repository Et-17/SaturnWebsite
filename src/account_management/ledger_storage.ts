import type { Transaction, Account, Counterparty, UUID, UUIDMap } from "./ledger_state";
import { accounts, counterparties, transactions } from './ledger_state';
import example_ledger from '../example_ledger.json';
import { toRaw } from "vue";


export async function load_ledger(): Promise<void> {
    let json_string = localStorage["saturn.ledger"];
    if (json_string == undefined) {
        // await write_ledger_file(new Map(), new Map(), new Map());
        await load_example_ledger();
        json_string = localStorage["saturn.ledger"];
    }

    let ledger = JSON.parse(json_string, des_reviver);
    if (!ledger.ledger_accounts || !ledger.ledger_counterparties || !ledger.ledger_transactions) {
        throw "Malformed ledger file";
    }

    accounts.value = ledger.ledger_accounts;
    counterparties.value = ledger.ledger_counterparties;
    transactions.value = ledger.ledger_transactions;
}

export async function load_example_ledger(): Promise<void> {
    // Typescript doesn't know how to interpret the imported JSON, so we have to
    // kinda disable it here
    accounts.value = des_reviver("ledger_accounts", example_ledger.ledger_accounts as any);
    counterparties.value = des_reviver("ledger_counterparties", example_ledger.ledger_counterparties as any);
    transactions.value = des_reviver("ledger_transactions", example_ledger.ledger_transactions as any);
}

export async function save_ledger(): Promise<void> {
    // I add the ledger_ thing to prevent some name conflicts in the reviver. I
    // should resolve the name conflicts by checking "this" but whatever.
    let ledger = {
        "ledger_accounts": Array.from(toRaw(accounts.value)),
        "ledger_counterparties": Array.from(toRaw(counterparties.value)),
        "ledger_transactions": Array.from(toRaw(transactions.value))
    }
    let json_string = JSON.stringify(ledger);
    console.log(JSON.parse(json_string));

    localStorage["saturn.ledger"] = json_string;
}

// JSON doesn't actually support Maps, so we have to do some special
// deserialization stuff
function des_reviver(key: string, value: [UUID, any][]): any {
    if (key == "ledger_accounts") {
        // We store the Date objects as timestamps. This converts them back.
        let des_accounts = value.map((entry) => {
            entry[1].creation_timestamp = new Date(entry[1].creation_timestamp);
            return entry;
        });
        return new Map(des_accounts)
    } else if (key == "ledger_counterparties") {
        return new Map(value);
    } else if (key == "ledger_transactions") {
        let des_transactions = value.map((entry) => {
            entry[1].timestamp = new Date(entry[1].timestamp);
            return entry;
        });
        return new Map(des_transactions);
    } else {
        return value;
    }
}
