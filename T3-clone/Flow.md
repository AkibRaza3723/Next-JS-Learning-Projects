https://github.com/Aestheticsuraj234/complete-nextjs-course-2026/tree/master/major-projects/t3-chat
# Installation 
* First installed the nextjs application then add the shadcn using the preset (can create through shadcn site).
* then add all the components using npx shadcn@latest add (to add all)
* Then for database add prisma (npm install prisma @prisma/client pg @prisma/adapter-pg) then initialise prisma in the folder structure through (npx prisma init) - then you can get your database url from neondb and add it in .env file
* then create a db.ts file in lib and copy the command to get exported prisma to use for operations. then you can use your commands like npx prisma generate or to send it to the DB you can use (npx prisma migrate dev). if u need to reset the db use "npx prisma migrate reset" (or just "npx prisma reset").
