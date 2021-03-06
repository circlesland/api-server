#!/bin/bash
sedArgument="s/REPLACE_ME_WITH_THE_CONNECTION_STRING/${DO_PGSQL_CONNECTIONSTRING//\//\\/}/g"
cp -f ./src/api-db/schema_template.prisma ./src/api-db/schema.prisma
sed -i "${sedArgument}" ./src/api-db/schema.prisma
npx prisma@3.13.0 --version
npx prisma@3.13.0 db push --schema=./src/api-db/schema.prisma
