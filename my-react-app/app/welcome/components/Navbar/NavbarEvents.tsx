import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleUser } from "@fortawesome/free-solid-svg-icons";

export function NavbarEvent({title = "Crear evento"}) {
    return (
        <nav className="w-full h-[80px] bg-[#4D869C] flex items-center justify-between px-6 shadow">
            <div className="flex-1 text-center">
                <h1 className="text-white text-xl font-semibold">
                    {title}
                </h1>
            </div>
            <div className="flex items-center justify-between pt-4">
                <div className="space-x-9 sm:flex pr-6">
                    <div className="flex items-center gap-3">
                        <form method="GET" action={route("caronte.logout")}>
                            <Button isIconOnly type="submit">
                                <FontAwesomeIcon
                                    icon={faCircleUser}
                                    className="text-white"
                                    size="2xl"
                                />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
}
