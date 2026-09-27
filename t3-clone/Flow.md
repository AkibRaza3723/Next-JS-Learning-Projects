https://github.com/Aestheticsuraj234/complete-nextjs-course-2026/tree/master/major-projects/t3-chat
# Installation - core
* First installed the nextjs application then add the shadcn using the preset (can create through shadcn site).
* then add all the components using npx shadcn@latest add (to add all)
* Then for database add prisma (npm install prisma @prisma/client pg @prisma/adapter-pg) then initialise prisma in the folder structure through (npx prisma init) - then you can get your database url from neondb and add it in .env file
* then create a db.ts file in lib and copy the command to get exported prisma to use for operations. then you can use your commands like npx prisma generate or to send it to the DB you can use (npx prisma migrate dev). if u need to reset the db use "npx prisma migrate reset" (or just "npx prisma reset").
* visit better auth docs and setup the better auth by given instructions. then create a route group (auth) to create the authentication page. then in that route create page.tsx for login and signup (or you can create a single page for login and signup). [except forget password - i'll do it later if needed] 
* Create a module for authentication - in action get the currentUser so that we can use that directly - then we create userButton.tsx for ui.
* UserButton is a button which gives up bunch of options we can use that code directly in another projects like it give dropdown with logout button and all the options.
* In actions write two more functions, requireAuth and requireUnAuth, use them to redirect users to the appropriate pages.
* Create a layout.tsx in root directory to wrap around these functions. (now we have directed the main home page in root with require auth and the signIn page with require unAuth).
* For light and dark theme use themeProvider (search dark theme on shadcn ui docs for ref) then add the code in provider and wrap the whole children inside layout.tsx it. (from this you can set theme according to the system - you modify it further tho)

