import Image from "next/image";

export default function NotificationPage() {
    return (
        <div className="w-full md:lg:xl:w-4/6 px-3 md:lg:xl:mx-auto">
            <div className="rounded shadow">
                <div className="header flex items-center rounded-t p-3 bg-slate-200">
                    <Image src="https://res.cloudinary.com/dsfybjdih/image/upload/v1716140186/bell_1_t8gweo.png" alt="Bell" width={30} height={30} /> <h3 className="text-lg font-bold mx-2">NOTIFICATIONS</h3>
                </div>
                <div className="border min-h-20">

                </div>
            </div>
        </div>
    )
}