# Saturn
An accessible financial manager. Run the program by going to [saturn.lkilborn.com](https://saturn.lkilborn.com/).

People with disabilities can struggle a lot with managing their finances or using financial management software. Especially people with Autism Spectrum Disorder (ASD) or Attention-Deficit Hyperactive Disorder (ADHD), like me, who can have trouble interacting with the complex interfaces and keeping things organized and non-overwhelming. With Saturn, I wanted to prioritize accessibility for all forms of disabilities, but primarily ADHD and ASD. I have intentionally kept the interface clear and simple. I have also ensured to have sufficient contrast between adjacent elements of the interface and designed the HTML structure with screen-readers in mind to aid vision-impaired people.

Saturn automatically saves in the background whenever you make a change. This means that you can close the program at any time, and reopen it later with your changes to the ledger still there. Saturn saves to the file `ledger.json`, which I have pre-loaded with an example ledger for judging. If at any time you wish to discard your changes and return to this example ledger, please click the `Open example ledger` text in the bottom left corner. Note, however, this will discard any changes that you made.

## Architecture

Saturn was built using Electron with a Vue frontend. Not only does Electron allow me to use web technologies to build a beautiful and dynamic desktop app, but it allows me to program the backend with Typescript (a typed superset of Javascript). By using the same language for all parts of the app, Electron creates seamless integration between the backend and the frontend. I can also easily port Saturn to the browser in the future; I would just need to change the way the backend interacts with the file system.

For the frontend, I employed Vue. This allows me to build up a responsive application and GUI by creating multiple single-purpose components that are then assembled into a complete application. Each component contains its own code and styling, keeping everything organized and easily adjustable. Using a web framework allows me to easily change the content of the GUI as the user interacts with it. I have paired it with Typescript, which adds type checking to Javascript and drastically reduces bugs in the program and makes developement faster. I also paired it with SCSS, which improves regular CSS and makes it much easier to work with.

## Interface

The interface was purposefully designed to be simple, non-overwhelming, and easy to understand. It has minimal large-scale movement so as to avoid hurting people with a sensitivity to flashing lights. It also has high contrast between adjacent elements and is optimized for screen-readers to aid vision-impaired people. You can use the three buttons on the left to switch between the recent transactions page, the accounts page, and the counterparties page.

### Recent Transactions

You can view a list of all recent transactions by clicking on the icon shaped like a house. It is also the default page when you open Saturn. The newest transactions are at the top. You can delete a transaction by clicking on the trash icon to the right of it, and you can edit a transaction by clicking on the pencil icon. To add a transaction, click the plus icon to the left at the bottom of the list. By clicking the download button to the right at the bottom of the list, you can export a Comma-Separated Value (CSV) copy of the transactions.

### Accounts

You can view a list of the accounts by clicking on the icon shaped like a bank. Similar to the recent transactions page, you can click the pencil icon to the right of an account to edit it, and the trash icon to delete it. Note that deleting an account will also delete any transactions associated with it. You can add an account by clicking on the plus button at the bottom.

If you click on the name of an account in this list, it will take you to a page that lists information about the account and every transaction associated with it. This transaction table works the same way as the one in recent transactions. The newest transactions are at the top. You can edit and delete by click the pencil and trash can respectively. You can click the plus icon to add a transaction, and the form will automatically populate with the currently selected account. You can also export the transactions of the currently selected account by pressing the download icon.

### Counterparty

Because transactions can be both a deposit and a withdrawl, it doesn't make much sense to have a group named buyers or sellers. Instead, I have opted to use the financial term "counterparty", simply denoting the other side in a transaction. Your employer is a counterparty when they pay you, and Publix is a counterparty when you buy groceries.

You can view a list of the counterparties by clicking on the icon shaped like a storefront. The same add and delete icons are used here as well. You can also click on the plus button to add a counterparty. Similar to accounts, deleting a counterparty will also delete all transactions associated with it.

If you click on the name of a counterparty in the list, it will take you to a page that shows information about the counterparty and all transactions associated with it. Here too, you can edit and delete the transactions, as well as add new ones. The form will automatically populate with the currently selected counterparty. You can export the transactions of the currently selected counterparty by clicking the download icon.
