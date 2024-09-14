export declare global {

    interface Tag{
        name: string
    }

    interface Role {
        id: string;
        name: string;
    }
    

    interface Author{
        id: string,
        name: string,
        email: string,
        image: string,
        roles: Role[]
    }

    interface Article {
        id: string,
        title: string,
        content: string,
        coverImage?: string,
        authorEmail: string,
        status: string,
        createdAt: DateTime,
        updatedAt: DateTime,
        author: Author,
        tags: Tag[],
    }
}