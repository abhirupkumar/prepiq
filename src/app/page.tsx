import HomePage from "@/containers/HomePage";
import { getCurrentUser } from "@/lib/auth-actions";

export default async function Home() {
  const { user, isAuth } = await getCurrentUser();

  return <HomePage isAuth={isAuth} user={user} />;

}