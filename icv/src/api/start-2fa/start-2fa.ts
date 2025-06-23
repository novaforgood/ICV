import { getAuthenticatedAppForUser } from "@/lib/serverApp";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { Resend } from "resend";

export async function POST(req: Request){
    const { firebaseServerApp, currentUser } = 
        await getAuthenticatedAppForUser()
        if (!currentUser) {
            throw new Error('User not found')
        }
    const ssrdb = getFirestore(firebaseServerApp)
    const { uid, email } = await req.json();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 20 * 60 * 1000;
  
    // Store in Firestore
    await setDoc(doc(ssrdb, "2facodes", uid), {
      code,
      expiresAt,
      createdAt: new Date()
    });
  
    // Email it 
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "noreply@icv.com",
      to: email,
      subject: "Your 2FA Code",
      html: `<p>Your code is <strong>${code}</strong>. It expires in 20 minutes.</p>`
    });
  
    return new Response("Sent", { status: 200 });
  }
