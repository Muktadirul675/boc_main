'use client';

import { FormEvent, createContext, useActionState, useState } from "react";
import ContentField from "./ContentField";
import TagsField from "./TagsField";
import TitleField from "./TitleField";

import axios from "axios";
import CoverImageField from "./CoverImageField";
import SubmitButton from "./SubmitButton";
import { submitArticle as submitAction } from "@/app/actions";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

export interface ArticleAddContextType {
    title: string,
    updateTitle: (title: string) => void,
    content: string,
    updateContent: (content: string) => void,
    tags: string[],
    updateTags: (tags: string[]) => void,
    thumbnail: File | undefined,
    updateThumbnail: (thumbnail: File) => void 
}

export const Context = createContext<ArticleAddContextType | null>(null)

export default function ArticleAddForm() {
    const [title, setTitle] = useState<string>('')
    const [tags, setTags] = useState<string[]>([])
    const [content, setContent] = useState<string>('')
    const [thumbnail, setThumbnail] = useState<File>()

    function updateTitle(title: string) {
        setTitle(title);
    }

    function updateTags(tags: string[]) {
        setTags(tags)
    }

    function updateContent(content: string) {
        setContent(content)
    }

    function updateThumbnail(thumbnail: File) {
        setThumbnail(thumbnail)
    }

    const contextValues = { title, updateTitle, content, updateContent, tags, updateTags, thumbnail, updateThumbnail };

    const submitArticle = submitAction.bind(null,tags);
    const [formState,action] = useFormState(submitArticle,{type:'',message:'',data:{id:''}});

    if(formState?.message === 'created'){
        // toast.success('Article Created')
        redirect('/articles')
    }

    return (
        <Context.Provider value={contextValues}>
            <form action={action}>
                <button className="hidden" disabled></button>
                <TitleField />
                <br />
                <ContentField />
                <br />
                <TagsField /> <br />
                <CoverImageField/>
                <br />
                <SubmitButton/>
            </form>
        </Context.Provider>
    )
}