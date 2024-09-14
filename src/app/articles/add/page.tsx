import ArticleAddForm from "@/components/articles/add/ArticleAddForm";

export default function AddArticlePage() {
    return (
        <div className="w-full lg:xl:w-2/6 mx-auto p-3">
            <div className="mb-2">
                <h3 className="text-xl font-bold">Add Article</h3>
            </div>
            <ArticleAddForm />
        </div>
    )
}