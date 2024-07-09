import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {

    const { answer, jobId, questionId } = await request.json();
    const supabase = createClient();

    const { data: data1, error: error1 } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)

    if (error1) {
        console.log("Some error occured: ", error1)
        return NextResponse.json({ success: false, error: error1.message }, { status: 401 });
    }

    const { data: data2, error: error2 } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single()
    if (error2) {
        console.log("Some error occured: ", error2)
        return NextResponse.json({ success: false, error: error2.message }, { status: 401 });
    }

    const prompt = `
    `

    const res: any = await model.invoke(prompt);

    return NextResponse.json({ success: true }, { status: 200 });
}
