import { AssemblyAI } from "assemblyai";
import axios from "axios";

export async function getAssemblyClient() {
    return new AssemblyAI({
        apiKey: process.env.ASSEMBLYAI_API_KEY!,
    });
}

export async function getAssemblyApiKey() {
    return process.env.ASSEMBLYAI_API_KEY!;
}