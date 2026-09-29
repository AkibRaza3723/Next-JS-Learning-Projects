import { NextResponse,NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const res=await fetch("https://openrouter.ai/api/v1/models", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if(!res.ok){
            throw new Error(`Failed to fetch models: ${res.statusText}`)
        }
        const data = await res.json(); 

        const freemodel = data.data.filter((model:any) => {
            const promptprice = parseFloat(model.pricing?.prompt || "0");
            const outputprice = parseFloat(model.pricing?.output || "0");
            return promptprice === 0 && outputprice === 0
        })

        //formetted models 
        const formattedModels = freemodel.map((model:any) => ({
            id:model.id,
            name:model.name,
            description:model.description,
            provider:model.provider,
            architecture:model.architecture,
            pricing:model.pricing,
            context_length: model.context_length,
            top_provider: model.top_provider,
            isFree:true,
        }))
        return NextResponse.json({
            models:formattedModels
        },{status:200});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to get AI models' }, { status: 500 });
    }
}  