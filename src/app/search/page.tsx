import SearchField from "@/components/search/SearchField";
import { FormControl, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

export default function SearchPage() {
    return (
        <div className="w-full lg:md:xl:w-3/6 p-3 mx-auto">
            <form action="">
                <SearchField/>
            </form>
        </div>
    )
}