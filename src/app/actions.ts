'use server';

import { auth } from '@/auth';
import { PrismaClient } from "@prisma/client";
import {v4 as uuidv4} from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

function tagExists(allTags: Object[], tag: string) {
    for (var i of allTags) {
        if ((i as any).name === tag) return true;
    }
    return false;
}

function getTagId(allTags: Object[], tag: string) {
    if (tagExists(allTags, tag)) {
        for (var i of allTags) {
            if ((i as any).name == tag) return (i as any).id
        }
    }
    return null;
}

interface TagToConnect {
    id: string,
}

interface TagToCreate {
    name: string,
}

export async function submitArticle(tags:string[],prevState: any, formData: FormData) {
    prisma.$connect()

    const session = await auth();
    const thumbnail = formData.get('thumbnail') as File
    if((thumbnail as any).size > 512000) return;
    
    const buffer = Buffer.from(await thumbnail.arrayBuffer())
    const thumbnailName = `${new Date().getDate()}_${new Date().getTime()}_${uuidv4()}_${path.extname(thumbnail.name)}`
    const thumbnailPath = path.join(process.cwd(), 'public','uploads','articles','thumbnails', thumbnailName)

    try{
        await fs.mkdir(path.dirname(thumbnailPath),{recursive:true})
        await fs.writeFile(thumbnailPath, buffer)
    }catch(error){
        console.log('error',error)
    }

    const newArticle = await prisma.article.create({
        data: {
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            coverImage: `${thumbnailName}`,
            author: {
                connect: {
                    email: session?.user?.email as string
                }
            }
        },
        select:{id:true}
    })

    for (var tag of tags) {
        const updateRes = await prisma.article.update({
            where: { id: newArticle.id },
            data: {
                tags: {
                    connectOrCreate: {
                        where: { name: tag },
                        create: { name: tag }
                    }
                }
            }
        })
    }

    prisma.$disconnect()
    return {type:'success',message:'created',data:newArticle};
}

export async function makeModerator(prevState : any,formData: FormData){
    prisma.$connect()
    const id = formData.get('user_id') as string
    const name = formData.get('user_name') as string
    // console.log(id,name)
    try{
        const res = await prisma.user.update({
            where:{id:id},
            data:{
                roles:{
                    connect:{id: 'bocModerator'}
                }
            },
            include:{roles:true}
        })
        // console.log(res)
    }catch (error){
        return {type:'error',message:error}
    }

    // revalidatePath("/admin/users")
    prisma.$disconnect()
    return {type:'success',message:`${name} is a moderator now`}
}

export async function removeModerator(prevState : any,formData: FormData){
    prisma.$connect()
    const id = formData.get('user_id') as string
    const name = formData.get('user_name') as string
    console.log(id,name)
    try{
        const res = await prisma.user.update({
            where:{id:id},
            data:{
                roles:{
                    disconnect:{id: 'bocModerator'}
                }
            },
            include:{roles:true}
        })
        console.log(res)
    }catch (error){
        return {type:'error',message:error}
    }
    revalidatePath("/admin/users")
    prisma.$disconnect()
    return {type:'info',message:`${name} is not a moderator anymore`}
}

export async function makeWriter(prevState : any,formData: FormData){
    prisma.$connect()
    const id = formData.get('user_id') as string
    const name = formData.get('user_name') as string
    try{
        await prisma.user.update({
            where:{id:id},
            data:{
                roles:{
                    connect:{id: 'bocWriter'}
                }
            }
        })
    }catch (error){
        return {type:'error',message:error}
    }

    prisma.$disconnect()
    revalidatePath("/admin/users")
    return {type:'success',message:`${name} is a writer now`}
}


export async function removeWriter(prevState : any,formData: FormData){
    prisma.$connect()
    const id = formData.get('user_id') as string
    const name = formData.get('user_name') as string
    try{
        await prisma.user.update({
            where:{id:id},
            data:{
                roles:{
                    disconnect:{id: 'bocWriter'}
                }
            }
        })
    }catch (error){
        return {type:'error',message:error}
    }

    prisma.$disconnect()
    revalidatePath("/admin/users")
    return {type:'success',message:`${name} is a writer now`}
}



export async function removeAdmin(prevState : any,formData: FormData){
    prisma.$connect()
    const id = formData.get('user_id') as string
    const name = formData.get('user_name') as string
    try{
        await prisma.user.update({
            where:{id:id},
            data:{
                roles:{
                    disconnect:{id: 'bocAdmin'}
                }
            }
        })
    }catch (error){
        return {type:'error',message:error}
    }

    prisma.$disconnect()
    revalidatePath("/admin/users")
    return {type:'success',message:`${name} is a writer now`}
}



export async function addAdmin(prevState : any,formData: FormData){
    prisma.$connect()
    const id = formData.get('user_id') as string
    const name = formData.get('user_name') as string
    try{
        await prisma.user.update({
            where:{id:id},
            data:{
                roles:{
                    disconnect:{id: 'bocAdmin'}
                }
            }
        })
    }catch (error){
        return {type:'error',message:error}
    }

    prisma.$disconnect()
    revalidatePath("/admin/users")
    return {type:'success',message:`${name} is a writer now`}
}



