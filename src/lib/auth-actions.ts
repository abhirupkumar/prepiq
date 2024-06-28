"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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
    const user: any = !isAuth ? null : {
        ...data?.user,
        ...data?.user?.user_metadata
    };
    return { user, isAuth };
}
