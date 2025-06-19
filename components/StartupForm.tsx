"use client";

import React from 'react';
import {useState, useActionState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
// import MDEditor from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { Send } from 'lucide-react';
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {formSchema} from "@/lib/validation";
import {z} from 'zod'
import {createPitch} from "@/lib/actions";
import "react-markdown-editor-lite/lib/index.css";


// Dynamic import MDEditor để tránh lỗi SSR
// const MDEditor = dynamic(
//     () => import('@uiw/react-markdown-editor'),
//     {
//         ssr: false,
        // loading: () => (
        //     <div className="w-full h-[300px] border border-gray-300 rounded-[20px] flex items-center justify-center bg-gray-50">
        //         <p className="text-gray-500">Loading editor...</p>
        //     </div>
        // )
//     }
// );

const StartupForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [pitch, setPitch] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData)=> {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                pitch,
            };

            await formSchema.parseAsync(formValues);

            const result = await createPitch(prevState, formData, pitch);

            if (result.status == 'SUCCESS') {
                toast({
                    title: "Success",
                    description: "Your startup pitch has been created successfully",
                });

                router.push(`/startup/${result._id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;

                setErrors(fieldErrors as unknown as Record<string, string>);

                toast({
                    title: "Error",
                    description: "Please check your inputs and try again",
                    variant: "destructive",
                });

                return { ...prevState, error: "Validation failed", status: "ERROR" };
            }

            toast({
                title: "Error",
                description: "An unexpected error has occurred",
                variant: "destructive",
            });

            return {
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {error: "", status: "INITIAL"});


    return (
        <form action={formAction} className='startup-form'>
            <div>
                <label htmlFor="title" className='startup-form_label'>
                    Title
                </label>
                <Input id='title' name='title' className='startup-form_input' required placeholder='Startup Title' />

                {errors.title && <p className="startup-form_error" >{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className='startup-form_label'>
                    Description
                </label>
                <Textarea id='description' name='description' className='startup-form_textarea' required placeholder='Startup Description' />

                {errors.description && (<p className="startup-form_error" >{errors.description}</p>)}
            </div>

            <div>
                <label htmlFor="category" className='startup-form_label'>
                    Category
                </label>
                <Input id='category' name='category' className='startup-form_input' required placeholder='Startup Category (Tech, Health, Education...)' />

                {errors.category && (<p className="startup-form_error" >{errors.category}</p>)}
            </div>

            <div>
                <label htmlFor="link" className='startup-form_label'>
                    Image URL
                </label>
                <Input id='link' name='link' className='startup-form_input' required placeholder='Startup Image URL' />

                {errors.link && <p className="startup-form_error" >{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="pitch" className='startup-form_label'>
                    Pitch
                </label>

                <Textarea
                    id="pitch"
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    className='startup-form_textarea'
                    placeholder="Briefly describe your idea and what problem it solves. You can use markdown syntax for formatting."
                    rows={10}
                    style={{
                        borderRadius: 20,
                        minHeight: '300px',
                        resize: 'vertical'
                    }}
                />

                {errors.pitch && <p className="startup-form_error" >{errors.pitch}</p>}
            </div>

            <Button type='submit' className='startup-form_btn text-white' disabled={isPending} >
                {isPending ? 'Submitting...' : "Submit Your Pitch"}
                <Send className='size-6 ml-2' />
            </Button>
        </form>
    )
}
export default StartupForm;
