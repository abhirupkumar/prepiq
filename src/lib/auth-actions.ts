"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { absoluteUrl } from "./utils";

export async function signout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log(error);
        redirect("/error");
    }
}

export const getCurrentUser = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    const isAuth = (error || !data?.user) ? false : true;
    const user: any = !isAuth ? null : data?.user?.user_metadata;
    return { user, isAuth };
}
