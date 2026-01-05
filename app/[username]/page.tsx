import { getUserByUsername } from "@/auth";
import PublicProfile from "./components/PublicProfile";

const Page = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const user = await getUserByUsername(username);

  

  return <PublicProfile user={user} />;
};

export default Page;
