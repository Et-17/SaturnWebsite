import { PathLike } from "node:fs";
import { Transaction, Account, Counterparty, UUID, UUIDMap } from "./ledger_state";
import fs from "node:fs/promises";

// In Electron, you can only access files in secure contexts so the functions
// in this file cannot be accessed directly. They get loaded globally in 
// preload.ts. Look at ../interface.d.ts for more info.

export async function write_ledger_file(path: PathLike, accounts: UUIDMap<Account>, counterparties: UUIDMap<Counterparty>, transactions: UUIDMap<Transaction>): Promise<void> {
    // I add the ledger_ thing to prevent some name conflicts in the reviver. I
    // should resolve the name conflicts by checking "this" but whatever.
    let ledger = {
        "ledger_accounts": Array.from(accounts.entries()),
        "ledger_counterparties": Array.from(counterparties.entries()),
        "ledger_transactions": Array.from(transactions.entries())
    }
    let json_string = JSON.stringify(ledger);
    console.log(JSON.parse(json_string));

    return fs.writeFile(path, json_string, { encoding: "utf8" });
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

export async function read_ledger_file(path: PathLike): Promise<[UUIDMap<Account>, UUIDMap<Counterparty>, UUIDMap<Transaction>]> {
    console.log("loading ledger from", path);

    let json_string: string = "";
    try {
        json_string = await fs.readFile(path, { encoding: "utf8" });
    } catch (error: any) {
        if (error.code = "ENOENT") {
            // Ledger file doesn't exist, create it
            await write_ledger_file(path, new Map(), new Map(), new Map());
            return [new Map(), new Map(), new Map()];
        }
    }

    let ledger = JSON.parse(json_string, des_reviver);
    if (!ledger.ledger_accounts || !ledger.ledger_counterparties || !ledger.ledger_transactions) {
        throw "Malformed ledger file";
    }

    return [ledger.ledger_accounts, ledger.ledger_counterparties, ledger.ledger_transactions];
}
