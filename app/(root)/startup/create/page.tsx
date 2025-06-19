import React from 'react';
import {redirect} from "next/navigation";
import StartupForm from "@/components/StartupForm";
import {auth} from "@/auth";

const Page = async () => {
    const session = await auth();

    if (!session) redirect('/');

    return (
        <div>
            <section className='pink_container !min-h-[230px]'>
                <h1 className='heading'>Submit Your Startup</h1>
            </section>

            <StartupForm />
        </div>
    )
}
export default Page
