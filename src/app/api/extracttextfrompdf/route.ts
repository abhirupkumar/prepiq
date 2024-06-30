import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
    const formData: FormData = await req.formData();
    const uploadedFile = formData.get('file')!;
    let parsedText = '';
    try {
        const arrayBuffer = await (uploadedFile as File).arrayBuffer();
        const buffer = Buffer.from(new Uint8Array(arrayBuffer));
        const data = await pdfParse(buffer);
        parsedText = data.text;
        return NextResponse.json({ text: parsedText }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
