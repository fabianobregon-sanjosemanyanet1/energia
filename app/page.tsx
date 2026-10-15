import { getChatGPTUser, chatGPTSignInPath } from "./chatgpt-auth";
import EnergyApp from "./energy-app";
export const dynamic = "force-dynamic";
export default async function Page() { const user = await getChatGPTUser(); return <EnergyApp signedIn={!!user} signInPath={chatGPTSignInPath("/")} />; }
