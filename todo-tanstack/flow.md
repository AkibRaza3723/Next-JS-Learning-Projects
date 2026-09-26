# flow of the project
* first install the next.js and intilise the project 
* visit ui.shadcn website to get the ui (npx shadcn@latest init -t next)
* setup mongoose database
* Install tanstack
* create a query client provider and then wrap the main layout's page into that client provider so that the whole part can able to use the provider function. (can read more about provider file.)
* Now for custom toast use sonner of shadcn (npx shadcn@latest add sonner) (read docs for customization)
    * Import toster in layout file and call it in html then define propeties in that - position mainly 
    * Now while using it through toast - we can define multiple properties like description position and style
    * while importing it itself create a ui in components called sonner
* imported a check icon from lucid react. (learn tailwind)
* added input.jsx using shadcn input component
* then created model for storing data in mongoDB
* after that for create todo action we have to validate the data from zod so npm i zod also create a dir schemas
* after validation pass that data into DB using use server action part.
* fix the todo form and add mutation in that (currently didn't provided invalidation)
* Create get todos server action to create todo item component
* the todo list will do the work of showing the data but when we update the new todo it willl not refresh the ui at that time so for that we have to use todo item mutation.
* added checkbox form shadcn installation to show it in the item
* in items we used cn function which comes with shadcn in util which helps to write dynamic classname very easily
* now to create active refresh inside todo form set invalidation using query clinet
* **form mei mutation mei jab new add hoga to vo todos key wali query ko invalidate kr dega and invalidate hone ke baad vo todo dubara load hogi todo list mei and then vo print hogi using todoitem (through map)**
* Now we mark todo as completed using mutation (create toggle function in actions then use mutations in items.)