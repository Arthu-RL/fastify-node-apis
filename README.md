steps typescript dev env installation:

    On ubuntu -> do a symbolic link -> ln -s absolute/path/to/node-v20.11.1-linux-x64/bin/node usr/bin/node && usr/bin/npm && usr/bin/npm
    Install nodejs -> 'Welcome to Node.js v20.11.1.'
    Install npm -> npm@10.2.4 absolute/path/to/node-v20.11.1-linux-x64/lib/node_modules/npm

install packages with npm:

    npm i typescript -D or npm i typescript@5.3.3 -D
    npm i tsx -D
    npm i @types/node -D
    npm i prisma -D

    "devDependencies": {
      "@types/node": "^20.11.19",
      "prisma": "^5.10.2",
      "tsx": "^4.7.1",
      "typescript": "^5.3.3"
    },

    npm i fastify
    npm i @prisma/client

    "dependencies": {
      "@prisma/client": "^5.13.0",
      "fastify": "^4.26.2",
      "zod": "^3.23.6"
    }

npm init -y // start node dev env
npm run dev // run script in package.json
npx tsc --init -> generates tsconfig.json
tsconfig.json -> "target": "es2020"

npx tsx requisitions.ts // compile and run typescript code

in package.json:
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "tsx watch server.ts"
  },

runinng mysql server:
  sudo docker run -d --name mysql \
    -e MYSQL_USER=user \
    -e MYSQL_PASSWORD=root \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=mydb \
    -v /path/to/mysql_data:/var/lib/mysql \
    -p 3307:3306 mysql:latest

    DATABASE_URL="mysql://root:root@localhost:3307/mydb"

    npx prisma init

    npx prisma generate

    npx prisma migrate dev --name init

    npx prisma migrate reset --force

Criar model, nome do model no SINGULAR, nome da tabela no PLURAL

directors to create:

 - src/controllers -> will have the controllers, which will use the mysql commands implemented in src/lib 
 - src/http -> will have all endpoints for the functions inside de controllers
 - src/lib -> will have all prisma queries (like mysql queries for BD)
