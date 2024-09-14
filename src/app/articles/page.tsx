import ArticleComp from "@/components/articles/Article"
import ArticleContent from "@/components/articles/ArticleContent"
import { PrismaClient } from "@prisma/client"
import { Key, ReactNode } from "react"

const prisma = new PrismaClient()

export default async function ArticlesPage() {
    const articles : any[] = await prisma.article.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            coverImage: true,
            createdAt: true,
            updatedAt: true,
            tags: {
                select: {
                    name: true,
                }
            },
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    roles: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        },
    })
    return (
            <div className="w-full md:lg:xl:w-2/6 mx-auto">
                {articles.map((article: Article)=><ArticleContent key={article.id} article={article}/>)}
            </div>
    )
}