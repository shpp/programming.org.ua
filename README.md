### Prerequisites
To work with project install [nvm](https://github.com/nvm-sh/nvm) and install nodejs version from [.nvmrc](https://github.com/ihor-bobyr/programming.org.ua/blob/master/.nvmrc) file by [nvm](https://github.com/nvm-sh/nvm). After that call `nvm use` (to use correct nodejs version) in terminal.

### Development
 Call `npm run start` after. This will run webpack dev server in `http://localhost:8080`.

### Production
Call `npm run build` after. You will get static sites artifacts in `/dist` folder that can be served later by some server.
