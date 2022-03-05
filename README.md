EvoMazes 
=================================

This project is a clone of the [Counter example in AssemblyScript](https://github.com/near-examples/counter) albeit very little of it has been kept.

## Description

This contract implements some basic functions to create evolutionary contracts using idea from [Evolutionary Computation](https://en.wikipedia.org/wiki/Evolutionary_computation)

The contract itself is a [Quine](https://en.wikipedia.org/wiki/Quine_(computing)) which is a program able to reproduce its own source code.

This contract implements a set of simple functions for the parametric generation of mazes. The parameters can be mutated to obtain new mazes. The randomised parameters are sourced from the blockchain.
Saving the parameters links the parents-child relation in the blockchain. This could be used to produce genealogy trees of the process or recreate old mazes.

## To Run
clone the repository.


## Setup 
Install dependencies:

```
yarn --frozen-lockfile
```

Make sure you have `near-cli` by running:

```
near --version
```

If you need to install `near-cli`:

```
npm install near-cli -g
```

## Login

In the project root, login with `near-cli` by following the instructions after this command:

```
near login
```

Modify the top of `src/config.js`, changing the `CONTRACT_NAME` to be the NEAR account name in the file `neardev/dev-account`. It starts with `dev-`.

```javascript
…
const CONTRACT_NAME = 'neardev/dev-account ACCOUNT ID'; /* TODO: fill this in! */
…
```

Start the example!

```
yarn start
```

## Main changes from the original project are in

- `assembly/main.ts` the contract code
- `src/index.html` the front-end HTML
- `src/main.js` JavaScript front-end code and contract integration



